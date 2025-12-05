import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (serviceAccount) {
    // If service account key is provided as JSON string
    try {
      const serviceAccountJson = JSON.parse(serviceAccount);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountJson),
      });
      console.log('✅ Firebase Admin SDK initialized using service account key');
    } catch (error) {
      console.error('❌ Error parsing Firebase service account key:', error);
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format');
    }
  } else if (projectId) {
    // Alternative: Use individual environment variables
    if (!clientEmail || !privateKey) {
      console.error(
        '❌ Firebase configuration incomplete. FIREBASE_PROJECT_ID is set but FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY is missing.'
      );
      if (process.env.NODE_ENV !== 'production') {
        console.warn('⚠️  Firebase Admin SDK not initialized. Please check your .env file.');
      }
    } else {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: projectId.trim(),
            clientEmail: clientEmail.trim(),
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        });
        console.log('✅ Firebase Admin SDK initialized using individual variables');
      } catch (error) {
        console.error('❌ Error initializing Firebase Admin SDK:', error);
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            '⚠️  Firebase Admin SDK initialization failed. Please check your credentials.'
          );
        }
      }
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '⚠️  Firebase Admin SDK not initialized. Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID in .env to enable Firebase authentication.'
      );
    }
  }
}

export default admin;
