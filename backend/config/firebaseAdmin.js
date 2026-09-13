// backend/config/firebaseAdmin.js
const admin = require('firebase-admin');

let isInitialized = false;

function initFirebaseAdmin() {
  if (isInitialized) return admin;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      // Format private key if escaped newlines are present in env variables
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        })
      });

      isInitialized = true;
      console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('⚠️ Firebase Admin SDK initialization error:', error.message);
    }
  } else {
    console.warn('⚠️ Firebase Admin credentials not set in environment (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY). Social login token verification will wait for these credentials.');
  }

  return admin;
}

initFirebaseAdmin();

module.exports = {
  admin,
  isFirebaseAdminReady: () => isInitialized
};
