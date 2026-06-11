import { db, auth } from './config';
import { collection, addDoc, getDocs, doc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';

// ─── Hugging Face Config ──────────────────────────────────────
const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

const buildPrompt = (systemMsg, userMsg) => `<s>[INST] <<SYS>>\n${systemMsg}\n<</SYS>>\n\n${userMsg} [/INST]`;

const callHuggingFace = async (prompt, hfKey) => {
  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${hfKey}` },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 500, temperature: 0.75, top_p: 0.9, do_sample: true, return_full_text: false },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 503 && err.estimated_time) {
      await new Promise(r => setTimeout(r, Math.min(err.estimated_time * 1000, 20000)));
      return callHuggingFace(prompt, hfKey);
    }
    throw new Error(err.error || `HF API error ${response.status}`);
  }

  const data = await response.json();
  const raw = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
  if (!raw) throw new Error('Empty response from Hugging Face');
  return raw.trim();
};

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

const mockContent = {
  caption: (gymName, location) => `🔥 YOUR TRANSFORMATION STARTS TODAY!\n\n${gymName} in ${location} is where champions are made. 💪\n\n✅ AC gym with premium equipment\n✅ Certified personal trainers\n\nSlots filling up fast! 📞 Call NOW for your FREE trial session.\n\n#${gymName.replace(/\s/g, '')} #${location}Gym`,
  hashtags: (gymName, location) => `#${gymName.replace(/\s/g, '')}\n#${location}Gym\n#BestGymIn${location}\n#FitnessGoals\n#GymLife`,
  adcopy: (gymName, location) => `🚀 TRANSFORM YOUR BODY THIS MONTH!\n\n📍 ${gymName} — ${location}'s #1 Fitness Center\n\n✅ State-of-the-art equipment\n✅ Expert certified trainers\n✅ Flexible plans starting just ₹999/month\n\n⏰ LIMITED TIME OFFER — First month at 50% OFF!\n📞 Call or DM for your FREE trial session TODAY!`,
  blogideas: (gymName, location) => `1. Top 10 Exercises to Lose Weight Fast — ${gymName}'s Expert Guide\n2. How to Build Muscle in 90 Days: Step-by-Step Plan`,
  seokeywords: (gymName, location) => `Best gym in ${location}\nGym near me ${location}\nFitness center ${location}\n${gymName} ${location}`,
  emailcampaign: (gymName, location) => `📧 SUBJECT: Your Dream Body Awaits — Exclusive Offer Inside! 💪\n\nDear Fitness Enthusiast,\n\n${gymName} in ${location} is thrilled to offer you an EXCLUSIVE deal this month:\n\n🎯 SPECIAL MEMBERSHIP OFFERS:\n• Basic Plan: ₹999/month\n\n👉 [CLAIM YOUR OFFER NOW]`,
  reelideas: (gymName) => `1. "5AM Club" Morning Routine — Show trainers opening gym\n2. 30-Day Transformation — Before/after member split-screen`,
};

export const saveContent = async (userId, contentData) => {
  const aiRef = collection(db, 'users', userId, 'ai_content');
  const cleanData = Object.fromEntries(Object.entries(contentData).filter(([_, v]) => v !== undefined));
  const docRef = await addDoc(aiRef, { 
    ...cleanData, 
    is_saved: true,
    created_at: serverTimestamp()
  });
  return { id: docRef.id, ...cleanData, is_saved: true };
};

export const getSavedContent = async (userId, contentType) => {
  const aiRef = collection(db, 'users', userId, 'ai_content');
  let q = query(aiRef, where('is_saved', '==', true));
  
  if (contentType) {
    q = query(q, where('content_type', '==', contentType));
  }
  
  const querySnapshot = await getDocs(q);
  const content = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at?.toDate()?.toISOString() || new Date().toISOString()
  }));

  content.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return content;
};

export const deleteContent = async (id) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  const uid = auth.currentUser.uid;
  const docRef = doc(db, 'users', uid, 'ai_content', id);
  await deleteDoc(docRef);
};

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

  if (userId) {
    try {
      const aiRef = collection(db, 'users', userId, 'ai_content');
      const payload = {
        content_type: type,
        content: typeof content === 'string' ? content : content.join('\n'),
        gym_name: gymName,
        campaign_goal: campaignGoal,
        audience_type: audienceType,
        location,
        tone,
        is_saved: false,
        created_at: serverTimestamp()
      };
      const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined));
      await addDoc(aiRef, cleanPayload);
    } catch { /* silent */ }
  }

  return content;
};
