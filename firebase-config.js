/**
 * RocketscriptZ - Firebase Cloud Firestore Configuration
 * Project: rocketscriptz-hub
 */
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBCZdUq2gEmz_Zhc7XAnY0oa9Uds3hk1lI",
    authDomain: "rocketscriptz-hub.firebaseapp.com",
    projectId: "rocketscriptz-hub",
    storageBucket: "rocketscriptz-hub.firebasestorage.app",
    messagingSenderId: "651082006114",
    appId: "1:651082006114:web:dfdfd5820505cc561e1b3b",
    measurementId: "G-M4HSN14WTH"
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FIREBASE_CONFIG;
} else if (typeof window !== 'undefined') {
    window.FIREBASE_CONFIG = FIREBASE_CONFIG;
}
