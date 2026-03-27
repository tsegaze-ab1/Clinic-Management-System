const admin = require("firebase-admin");

if (!admin.apps.length) {
  const hasServiceAccountEnv =
    !!process.env.FIREBASE_PROJECT_ID &&
    !!process.env.FIREBASE_CLIENT_EMAIL &&
    !!process.env.FIREBASE_PRIVATE_KEY;

  const hasGoogleApplicationCredentials =
    !!process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!hasServiceAccountEnv && !hasGoogleApplicationCredentials) {
    throw new Error(
      "Missing Firebase Admin credentials. Provide FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY or set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON path."
    );
  }

  const credential = hasServiceAccountEnv
    ? admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      })
    : admin.credential.applicationDefault();

  admin.initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID || undefined
  });
}

const db = admin.firestore();

module.exports = { admin, db };
