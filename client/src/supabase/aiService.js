import api from '../services/api';

// ─── Hugging Face Config ──────────────────────────────────────
// Using mistralai/Mistral-7B-Instruct-v0.3 — free, powerful, fast
const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

// ─── Build Mistral-format prompt ─────────────────────────────
const buildPrompt = (systemMsg, userMsg) =>
  `<s>[INST] <<SYS>>\n${systemMsg}\n<</SYS>>\n\n${userMsg} [/INST]`;

// ─── Call HuggingFace Inference API ──────────────────────────
const callHuggingFace = async (prompt, hfKey) => {
  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${hfKey}`,
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.75,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    // Model still loading — wait and retry once
    if (response.status === 503 && err.estimated_time) {
      await new Promise(r => setTimeout(r, Math.min(err.estimated_time * 1000, 20000)));
      return callHuggingFace(prompt, hfKey);
    }
    throw new Error(err.error || `HF API error ${response.status}`);
  }

  const data = await response.json();
  // API returns array: [{ generated_text: "..." }]
  const raw = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
  if (!raw) throw new Error('Empty response from Hugging Face');
  return raw.trim();
};

// ─── Prompts for each content type ───────────────────────────
const buildContentPrompt = (type, { gymName, location, campaignGoal, audienceType, tone }) => {
  const SYSTEM = `You are an expert gym digital marketing specialist for Indian gyms. 
Write compelling, specific, and action-oriented marketing content. 
Always include emojis, specific details, and strong calls-to-action.
For ${gymName} located in ${location}, India.`;

  const prompts = {
    caption: `Write 3 different Instagram captions for ${gymName} gym in ${location}.
Goal: ${campaignGoal}. Target audience: ${audienceType}. Tone: ${tone}.
Each caption must include relevant emojis, be under 150 words, and end with a strong CTA.
Format: Caption 1: [text]\nCaption 2: [text]\nCaption 3: [text]`,

    hashtags: `Generate 20 trending hashtags for ${gymName} gym in ${location}.
Target: ${audienceType}. Goal: ${campaignGoal}.
Mix: 5 local hashtags with city name, 10 popular fitness hashtags, 5 gym-specific hashtags.
Return ONLY the hashtags, one per line, starting with #.`,

    adcopy: `Write a high-converting Facebook/Instagram ad for ${gymName} in ${location}.
Goal: ${campaignGoal}. Target: ${audienceType}. Tone: ${tone}.
Structure: Hook line → Problem → Solution → Features (bullet points with ✅) → Price mention → Urgency → CTA.
Use emojis. Under 200 words.`,

    blogideas: `Generate 8 SEO-optimized blog post ideas for ${gymName} gym in ${location}.
Target audience: ${audienceType}. Include location keywords.
Format as numbered list: 1. [Title] — [1-line description]`,

    seokeywords: `Generate 20 local SEO keywords for ${gymName} gym in ${location}.
Target: ${audienceType}. Include:
- 5 "near me" keywords
- 5 service-specific keywords
- 5 location-based keywords  
- 5 competitor comparison keywords
Return one keyword per line, no bullets.`,

    emailcampaign: `Write a complete email marketing campaign for ${gymName} in ${location}.
Goal: ${campaignGoal}. Target: ${audienceType}. Tone: ${tone}.
Include: Subject line → Preview text → Greeting → Body with offer details → Plan pricing (₹999/mo, ₹2499/3mo, ₹7999/yr) → Urgency → CTA button text → Sign-off.
Use emojis and line breaks for readability.`,

    reelideas: `Generate 8 creative Instagram/YouTube Reel video ideas for ${gymName} gym.
Target: ${audienceType}. Make them viral-worthy and fitness-focused.
Format: 1. [Title] — [Hook] — [Content] — [CTA] (each on same line separated by dashes)`,
  };

  return buildPrompt(SYSTEM, prompts[type] || prompts.caption);
};

// ─── Rich Mock Content (used when no HF key) ─────────────────
const mockContent = {
  caption: (gymName, location) => `🔥 YOUR TRANSFORMATION STARTS TODAY!\n\n${gymName} in ${location} is where champions are made. 💪\n\nWhether you're a beginner or a pro, our expert trainers and world-class equipment will push you to your LIMIT.\n\n✅ AC gym with premium equipment\n✅ Certified personal trainers\n✅ Diet consultation included\n✅ Flexible membership plans\n\nSlots filling up fast! 📞 Call NOW for your FREE trial session.\n\n#${gymName.replace(/\s/g, '')} #${location}Gym #FitnessGoals #TransformationJourney #GymLife`,

  hashtags: (gymName, location) => `#${gymName.replace(/\s/g, '')}
#${location}Gym
#BestGymIn${location}
#${location}Fitness
#GymLife
#FitnessMotivation
#WorkoutDaily
#FitFam
#BodyTransformation
#TrainHard
#GainsMode
#FitIndia
#GymFreaks
#HealthyLifestyle
#NoPainNoGain
#PersonalTraining
#WeightLoss
#MuscleBuilding
#FitnessJourney
#GymCommunity`,

  adcopy: (gymName, location) => `🚀 TRANSFORM YOUR BODY THIS MONTH!

📍 ${gymName} — ${location}'s #1 Fitness Center

Are you tired of not seeing results? Our certified trainers have helped 500+ members achieve their dream body. Now it's YOUR turn.

✅ State-of-the-art equipment
✅ AC gym with premium changing rooms
✅ Expert certified trainers (NSCA/ACE certified)
✅ Personalized diet consultation
✅ Group classes: Zumba, Yoga, Cardio
✅ Flexible plans starting just ₹999/month

⏰ LIMITED TIME OFFER — First month at 50% OFF!

📞 Call or DM for your FREE trial session TODAY!
Don't wait — only 10 slots left this week!

💪 Train Hard. Eat Right. Live Better.`,

  blogideas: (gymName, location) => `1. Top 10 Exercises to Lose Weight Fast — ${gymName}'s Expert Guide
2. How to Build Muscle in 90 Days: Step-by-Step Plan
3. Best Pre-Workout Meals for Maximum Gym Performance
4. Yoga vs Weight Training: Which is Right for You in ${location}?
5. Why ${location} Fitness Enthusiasts Are Choosing ${gymName}
6. Complete Beginner's Guide to Starting Your Gym Journey
7. 5 Common Gym Mistakes (And How to Fix Them)
8. How to Stay Motivated Through Your Entire Fitness Journey`,

  seokeywords: (gymName, location) => `Best gym in ${location}
Gym near me ${location}
Fitness center ${location}
${gymName} ${location}
Affordable gym membership ${location}
Personal trainer ${location}
Weight loss gym ${location}
Ladies gym ${location}
24 hour gym ${location}
Bodybuilding gym ${location}
Yoga classes ${location}
Zumba classes ${location}
Diet consultation ${location}
Gym membership plans ${location}
Best fitness center ${location}
AC gym ${location}
Certified personal training ${location}
Muscle building gym ${location}
Cardio gym ${location}
Group fitness classes ${location}`,

  emailcampaign: (gymName, location) => `📧 SUBJECT: Your Dream Body Awaits — Exclusive Offer Inside! 💪
PREVIEW: First month FREE + Special discount for new members...

Dear Fitness Enthusiast,

We hope this message finds you motivated and ready to transform! 🌟

${gymName} in ${location} is thrilled to offer you an EXCLUSIVE deal this month:

🎯 SPECIAL MEMBERSHIP OFFERS:
• Basic Plan: ₹999/month (Save ₹200!)
• Pro Plan: ₹2,499/3 months (Save ₹500!)
• Elite Annual: ₹7,999/year (Save ₹2,000!)

What you get:
✅ Access to all gym equipment
✅ 2 FREE personal training sessions
✅ Diet consultation with our nutritionist
✅ Unlimited group classes (Yoga, Zumba, Cardio)
✅ Locker room & shower access

⏰ Offer valid till end of month only!

👉 [CLAIM YOUR OFFER NOW]

Have questions? Call us or visit us at ${location}.

Train Hard. Stay Fit. Live Better. 💪

Warm regards,
The ${gymName} Team`,

  reelideas: (gymName) => `1. "5AM Club" Morning Routine — Show trainers opening gym → equipment setup → first members arriving — Tag "Join us tomorrow 5AM!" 
2. 30-Day Transformation — Before/after member split-screen with dramatic music — "This could be YOU in 30 days"
3. "Day in the Life" at ${gymName} — Follow a trainer from 6AM to 9PM — Raw, authentic content
4. 5 Exercises You're Doing WRONG — Trainer corrects common mistakes — "Save this for your next workout"
5. Zumba Class Chaos 🕺 — Energetic group Zumba session highlights — "The most fun way to lose weight"
6. New Equipment Tour — Walk through every machine with trainer tips — "Have you tried this yet?"
7. Member Success Story — Interview format with before/after photos — "500+ transformations and counting"
8. "What We Eat in a Day" — Trainer shares their full diet plan — Links to gym's nutritionist`,
};

// ─── Save AI Content ──────────────────────────────────────────
export const saveContent = async (userId, contentData) => {
  const res = await api.post('/ai/save', { ...contentData, is_saved: true });
  return res.data;
};

// ─── Get Saved Content ────────────────────────────────────────
export const getSavedContent = async (userId, contentType) => {
  const params = {};
  if (contentType) params.type = contentType;
  const res = await api.get('/ai/saved', { params });
  return res.data;
};

// ─── Delete Saved Content ─────────────────────────────────────
export const deleteContent = async (id) => {
  await api.delete(`/ai/saved/${id}`);
};

// ─── Main Generate Function ───────────────────────────────────
export const generateAIContent = async ({ type, gymName, campaignGoal, audienceType, location, tone, userId }) => {
  const hfKey = import.meta.env.VITE_HF_API_KEY;
  let content;

  if (hfKey && hfKey !== 'your-hf-token-here') {
    try {
      const prompt = buildContentPrompt(type, { gymName, location, campaignGoal, audienceType, tone });
      content = await callHuggingFace(prompt, hfKey);
    } catch (err) {
      console.warn('HuggingFace API failed, using mock:', err.message);
      content = mockContent[type]?.(gymName, location) || mockContent.caption(gymName, location);
    }
  } else {
    content = mockContent[type]?.(gymName, location) || mockContent.caption(gymName, location);
  }

  // Auto-save to MongoDB if user is logged in
  if (userId) {
    try {
      await api.post('/ai/save', {
        content_type: type,
        content: typeof content === 'string' ? content : content.join('\n'),
        gym_name: gymName,
        campaign_goal: campaignGoal,
        audience_type: audienceType,
        location,
        tone,
        is_saved: false,
      });
    } catch { /* silent — user can still see content */ }
  }

  return content;
};
