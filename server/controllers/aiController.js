const MarketingContent = require('../models/MarketingContent');

// Mock AI responses for when no OpenAI key is provided
const mockCaptions = [
  "Transform your body at {gymName} 💪 Join today and unlock your true potential! Limited slots available.",
  "Your dream body starts here at {gymName}! 🔥 Train hard, eat right, and never give up. Join now!",
  "No excuses. Just results. 🏋️ {gymName} is your partner in fitness. Start your journey today!",
  "Sweat today. Shine tomorrow. ✨ Join {gymName} and experience world-class training. Book your free trial!",
  "Strong is the new sexy. 💥 {gymName} — where champions are made. Join our family today!",
];

const mockHashtags = [
  "#GymLife #FitnessMotivation #WorkoutDaily #FitFam #BodyTransformation #GymRohtak #FitnessGoals #TrainHard #GainsMade #FitIndia",
  "#Fitness #Gym #Workout #HealthyLifestyle #FitnessCommunity #GymLife #Motivation #Training #BodyBuilding #NoPainNoGain",
  "#RohtakGym #HaryanaFitness #GymNearMe #PersonalTraining #FitnessJourney #TransformationTuesday #GymFreaks #FitLife",
];

const mockAdCopies = [
  "🚀 LIMITED TIME OFFER!\n\n📍 {gymName}, {location}\n\n✅ State-of-the-art equipment\n✅ Expert certified trainers\n✅ Flexible membership plans starting ₹999/month\n✅ Personalized diet consultation\n✅ AC & changing rooms\n\n📞 Call now for FREE trial session!\n\n💥 Transform your body. Transform your life.",
  "⚡ NEW YEAR. NEW YOU. NEW BODY.\n\n{gymName} is offering EXCLUSIVE discounts this month!\n\n🏆 Award-winning trainers\n🏆 Modern gym equipment\n🏆 Diet & nutrition plans\n🏆 Group classes & personal training\n\nStarting from just ₹999/month\n\n🎯 Limited seats available. Book NOW!",
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const fillTemplate = (template, data) => {
  return template
    .replace(/{gymName}/g, data.gymName || 'Our Gym')
    .replace(/{location}/g, data.location || 'Your City');
};

// @desc    Generate caption
// @route   POST /api/ai/caption
const generateCaption = async (req, res) => {
  try {
    const { gymName, campaignGoal, audienceType, location } = req.body;

    let caption;

    // Try OpenAI if key exists
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert gym digital marketing specialist. Generate compelling, energetic social media captions for gyms.',
            },
            {
              role: 'user',
              content: `Generate an Instagram caption for ${gymName} gym in ${location}. Campaign goal: ${campaignGoal}. Target audience: ${audienceType}. Make it motivational, include emojis, and keep it under 150 words.`,
            },
          ],
          max_tokens: 200,
        });
        caption = completion.choices[0].message.content;
      } catch (openaiError) {
        caption = fillTemplate(getRandomItem(mockCaptions), { gymName, location });
      }
    } else {
      caption = fillTemplate(getRandomItem(mockCaptions), { gymName, location });
    }

    // Save to DB
    await MarketingContent.create({
      caption,
      campaignType: 'instagram',
      gymName,
      targetAudience: audienceType,
      location,
      userId: req.user._id,
    });

    res.status(200).json({ success: true, data: { caption } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate hashtags
// @route   POST /api/ai/hashtags
const generateHashtags = async (req, res) => {
  try {
    const { gymName, campaignGoal, audienceType, location } = req.body;

    let hashtags;

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a social media expert. Generate trending hashtags for gym marketing.',
            },
            {
              role: 'user',
              content: `Generate 15 trending Instagram hashtags for ${gymName} gym in ${location}, targeting ${audienceType}. Mix local hashtags with popular fitness hashtags. Return only hashtags separated by spaces.`,
            },
          ],
          max_tokens: 150,
        });
        hashtags = completion.choices[0].message.content;
      } catch (openaiError) {
        hashtags = getRandomItem(mockHashtags);
      }
    } else {
      hashtags = getRandomItem(mockHashtags);
    }

    res.status(200).json({ success: true, data: { hashtags } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate ad copy
// @route   POST /api/ai/adcopy
const generateAdCopy = async (req, res) => {
  try {
    const { gymName, campaignGoal, audienceType, location } = req.body;

    let adCopy;

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert copywriter specializing in gym and fitness marketing. Create high-converting ad copy.',
            },
            {
              role: 'user',
              content: `Create a Facebook/Instagram ad copy for ${gymName} in ${location}. Campaign goal: ${campaignGoal}. Target: ${audienceType}. Include bullet points, emojis, urgency, and a CTA. Keep under 200 words.`,
            },
          ],
          max_tokens: 300,
        });
        adCopy = completion.choices[0].message.content;
      } catch (openaiError) {
        adCopy = fillTemplate(getRandomItem(mockAdCopies), { gymName, location });
      }
    } else {
      adCopy = fillTemplate(getRandomItem(mockAdCopies), { gymName, location });
    }

    res.status(200).json({ success: true, data: { adCopy } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate blog ideas
// @route   POST /api/ai/blogideas
const generateBlogIdeas = async (req, res) => {
  try {
    const { gymName, location } = req.body;

    const ideas = [
      `Top 10 Exercises to Lose Weight Fast at ${gymName}`,
      `How to Build Muscle in 90 Days: ${gymName}'s Expert Guide`,
      `Best Pre-Workout Diet Plan for Maximum Gains`,
      `Yoga vs Weight Training: Which is Better for You?`,
      `Why ${location} Fitness Enthusiasts Choose ${gymName}`,
      `Complete Beginner's Guide to Starting Your Fitness Journey`,
      `5 Common Gym Mistakes and How to Avoid Them`,
      `How to Stay Motivated on Your Fitness Journey`,
    ];

    res.status(200).json({ success: true, data: { ideas } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate SEO keywords
// @route   POST /api/ai/seokeywords
const generateSEOKeywords = async (req, res) => {
  try {
    const { gymName, location } = req.body;

    const keywords = [
      `Best Gym in ${location}`,
      `Fitness Center in ${location}`,
      `Gym Near Me ${location}`,
      `${gymName} ${location}`,
      `Affordable Gym Membership ${location}`,
      `Personal Training ${location}`,
      `Weight Loss Gym ${location}`,
      `24 Hour Gym ${location}`,
      `Ladies Gym ${location}`,
      `Bodybuilding Gym ${location}`,
      `Yoga Classes ${location}`,
      `Zumba Dance Classes ${location}`,
      `Diet Consultation ${location}`,
      `Fitness Trainer ${location}`,
      `Gym Membership Plans ${location}`,
    ];

    res.status(200).json({ success: true, data: { keywords } });
  } catch (error) {
     res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save generated content
// @route   POST /api/ai/save
const saveMarketingContent = async (req, res) => {
  try {
    const { content_type, content, gym_name, campaign_goal, audience_type, location, tone, is_saved } = req.body;
    const doc = await MarketingContent.create({
      user_id: req.user._id,
      content_type, content, gym_name, campaign_goal, audience_type, location, tone,
      is_saved: is_saved !== undefined ? is_saved : true,
    });
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get saved content for user
// @route   GET /api/ai/saved?type=caption
const getSavedContent = async (req, res) => {
  try {
    const filter = { user_id: req.user._id, is_saved: true };
    if (req.query.type) filter.content_type = req.query.type;
    const docs = await MarketingContent.find(filter).sort({ created_at: -1 });
    res.status(200).json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete saved content
// @route   DELETE /api/ai/saved/:id
const deleteContent = async (req, res) => {
  try {
    await MarketingContent.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateCaption, generateHashtags, generateAdCopy, generateBlogIdeas, generateSEOKeywords,
  saveMarketingContent, getSavedContent, deleteContent,
};
