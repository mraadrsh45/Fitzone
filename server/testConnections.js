require('dotenv').config();
const mongoose = require('mongoose');
const admin = require('./config/firebase');

async function checkConnections() {
  console.log("=== Checking Firebase Admin ===");
  if (admin.apps.length > 0) {
    console.log("✅ Firebase Admin initialized successfully!");
    console.log(`   Project ID: ${admin.app().options.credential.projectId}`);
  } else {
    console.log("❌ Firebase Admin failed to initialize.");
  }

  console.log("\n=== Checking MongoDB ===");
  console.log("   URI:", process.env.MONGO_URI.replace(/:([^:@]{4,})@/, ':****@')); // hide password
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
    console.log(`   Database Name: ${mongoose.connection.name}`);
    await mongoose.disconnect();
  } catch (error) {
    console.log("❌ MongoDB connection failed!");
    console.log("   Error:", error.message);
  }
}

checkConnections();
