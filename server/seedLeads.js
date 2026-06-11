require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('./models/Lead');
const User = require('./models/User');

async function seedLeads() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const user = await User.findOne();
    if (!user) {
      console.log("No user found in the database. Please log in to the frontend once to sync your profile, then run this script again.");
      process.exit(1);
    }

    const dummyLeads = [
      { customer_name: "Alice Johnson", email: "alice@example.com", phone: "555-0101", fitness_goal: "Weight Loss", membership_interest: "basic", status: "new", user_id: user._id },
      { customer_name: "Bob Smith", email: "bob@example.com", phone: "555-0102", fitness_goal: "Muscle Gain", membership_interest: "pro", status: "contacted", user_id: user._id },
      { customer_name: "Charlie Davis", email: "charlie@example.com", phone: "555-0103", fitness_goal: "Endurance", membership_interest: "elite", status: "new", user_id: user._id },
      { customer_name: "Diana Prince", email: "diana@example.com", phone: "555-0104", fitness_goal: "Flexibility", membership_interest: "pro", status: "converted", user_id: user._id },
      { customer_name: "Evan Wright", email: "evan@example.com", phone: "555-0105", fitness_goal: "General Fitness", membership_interest: "basic", status: "lost", user_id: user._id },
    ];

    await Lead.insertMany(dummyLeads);
    console.log(`Successfully added 5 leads for user: ${user.email}`);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding leads:", err);
    process.exit(1);
  }
}

seedLeads();
