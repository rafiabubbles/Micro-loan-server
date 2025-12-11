// config/firebaseAdmin.js

const admin = require('firebase-admin');
const path = require('path');

// ⚠️ আপনার JSON ফাইলের পাথ এখানে দিন
// ধরে নিলাম JSON ফাইলটি config ফোল্ডারে আছে
const serviceAccount = require('./serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;