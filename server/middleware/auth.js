const admin = require('../config/firebase');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    let email;
    if (!admin.apps.length) {
      console.warn("⚠️ Bypassing Firebase signature verification because Admin SDK is missing!");
      const decodedToken = jwt.decode(token);
      if (!decodedToken || !decodedToken.email) throw new Error("Invalid token format");
      email = decodedToken.email;
    } else {
      const decodedToken = await admin.auth().verifyIdToken(token);
      email = decodedToken.email;
    }

    // Find user in MongoDB by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found in database' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

const verifyTokenOnly = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

  try {
    let decodedToken;
    if (!admin.apps.length) {
      decodedToken = jwt.decode(token);
    } else {
      decodedToken = await admin.auth().verifyIdToken(token);
    }
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Auth Middleware Error (verifyTokenOnly):', error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protect, verifyTokenOnly };
