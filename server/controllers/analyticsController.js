const Lead = require('../models/Lead');

// @desc    Get analytics data
// @route   GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const convertedLeads = await Lead.countDocuments({ status: 'converted' });
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

    // Monthly leads data (dummy + real blend)
    const monthlyLeads = [
      { month: 'Jan', leads: 45, revenue: 44550, visitors: 1200 },
      { month: 'Feb', leads: 52, revenue: 51480, visitors: 1450 },
      { month: 'Mar', leads: 61, revenue: 60390, visitors: 1680 },
      { month: 'Apr', leads: 58, revenue: 57420, visitors: 1590 },
      { month: 'May', leads: 74, revenue: 73260, visitors: 2100 },
      { month: 'Jun', leads: 83, revenue: 82170, visitors: 2400 },
      { month: 'Jul', leads: 91, revenue: 90090, visitors: 2750 },
      { month: 'Aug', leads: 79, revenue: 78210, visitors: 2300 },
      { month: 'Sep', leads: 95, revenue: 94050, visitors: 2900 },
      { month: 'Oct', leads: 108, revenue: 106920, visitors: 3200 },
      { month: 'Nov', leads: 115, revenue: 113850, visitors: 3500 },
      { month: 'Dec', leads: totalLeads + 122, revenue: 120780, visitors: 3800 },
    ];

    const membershipBreakdown = [
      { plan: 'Basic (₹999)', count: 142, percentage: 45 },
      { plan: 'Pro (₹2499)', count: 98, percentage: 31 },
      { plan: 'Elite (₹7999)', count: 76, percentage: 24 },
    ];

    const socialMediaStats = [
      { platform: 'Instagram', reach: 12500, engagement: 4.8, followers: 8900 },
      { platform: 'Facebook', reach: 8200, engagement: 3.2, followers: 6100 },
      { platform: 'YouTube', reach: 5600, engagement: 6.1, followers: 2800 },
      { platform: 'Google', reach: 18000, engagement: 2.9, impressions: 45000 },
    ];

    const campaignPerformance = [
      { name: 'New Year Offer', clicks: 1240, conversions: 89, spend: 5000, roi: '340%' },
      { name: 'Summer Fitness', clicks: 980, conversions: 72, spend: 4000, roi: '280%' },
      { name: 'Weight Loss Camp', clicks: 1580, conversions: 134, spend: 6500, roi: '420%' },
      { name: 'Ladies Special', clicks: 760, conversions: 58, spend: 3000, roi: '260%' },
    ];

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalLeads,
          convertedLeads,
          newLeads,
          conversionRate: `${conversionRate}%`,
          totalRevenue: '₹8,49,500',
          websiteVisitors: 28600,
          instagramReach: 12500,
          activeMemberships: 316,
        },
        monthlyLeads,
        membershipBreakdown,
        socialMediaStats,
        campaignPerformance,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnalytics };
