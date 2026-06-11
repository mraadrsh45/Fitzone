-- ============================================================
-- FitZone AI — Supabase PostgreSQL Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT UNIQUE,
  gym_name TEXT DEFAULT '',
  location TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  subscription TEXT DEFAULT 'free' CHECK (subscription IN ('free', 'basic', 'pro', 'elite')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================
-- GYMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gyms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  gym_name TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  description TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  services TEXT[] DEFAULT ARRAY['Weight Training', 'Cardio', 'Yoga'],
  pricing JSONB DEFAULT '{"basic": 999, "pro": 2499, "elite": 7999}'::jsonb,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  fitness_goal TEXT NOT NULL,
  membership_interest TEXT DEFAULT 'basic',
  source TEXT DEFAULT 'Website',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================
-- MARKETING CONTENT
-- ============================================================
CREATE TABLE IF NOT EXISTS public.marketing_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('caption', 'hashtags', 'adcopy', 'blogideas', 'seokeywords', 'emailcampaign', 'reelideas')),
  content TEXT NOT NULL,
  gym_name TEXT DEFAULT '',
  campaign_goal TEXT DEFAULT '',
  audience_type TEXT DEFAULT '',
  location TEXT DEFAULT '',
  tone TEXT DEFAULT 'motivational',
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================
-- MEMBERSHIPS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed default membership plans
INSERT INTO public.memberships (plan_name, price, duration, features, is_featured) VALUES
  ('Basic', 999, 'month', ARRAY['Gym equipment access', 'Locker room', '2 group classes/week', 'Fitness assessment', 'Mobile app'], false),
  ('Pro', 2499, '3 months', ARRAY['Everything in Basic', 'Unlimited group classes', '2 PT sessions/month', 'Diet consultation', 'Progress tracking', '2 guest passes/month', 'Priority equipment'], true),
  ('Elite', 7999, 'year', ARRAY['Everything in Pro', 'Unlimited personal training', 'Custom meal plans', 'Body composition analysis', 'Spa & recovery zone', 'Unlimited guest passes', '24/7 gym access', 'VIP support'], false)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ANALYTICS EVENTS (for realtime)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Gyms
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own gyms" ON public.gyms FOR ALL USING (auth.uid() = user_id);

-- Leads — allow public insert (landing page form), owner reads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can view leads" ON public.leads FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can update leads" ON public.leads FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can delete leads" ON public.leads FOR DELETE USING (auth.uid() IS NOT NULL);

-- Marketing content
ALTER TABLE public.marketing_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own content" ON public.marketing_content FOR ALL USING (auth.uid() = user_id);

-- Memberships — public read
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read memberships" ON public.memberships FOR SELECT USING (true);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- OPTIONAL: Auto-confirm email on signup (bypasses email/SMS verification)
-- Run this in your Supabase SQL Editor if you want to bypass verification during development!
-- ============================================================
-- CREATE OR REPLACE FUNCTION public.auto_confirm_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.email_confirmed_at = now();
--   NEW.confirmed_at = now();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
-- CREATE TRIGGER on_auth_user_created_confirm
--   BEFORE INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_new_user();


-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- REALTIME
-- ============================================================
-- Enable realtime for leads table
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_events;
