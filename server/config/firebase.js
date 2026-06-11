const admin = require('firebase-admin');

let serviceAccount = null;
try {
  serviceAccount = require('../../fitzone-ai-firebase-adminsdk-fbsvc-198079e892.json');
} catch (err) {
  console.warn('Firebase service account JSON not found.');
}
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin Initialized');
} else {
  console.warn('Firebase Admin NOT initialized - missing FIREBASE_SERVICE_ACCOUNT in env');
}

module.exports = admin;
