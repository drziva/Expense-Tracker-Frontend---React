import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

const registration = await navigator.serviceWorker.ready;

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function initPushNotifications() {
    try {
        const permission = await Notification.requestPermission();

        if(permission !== "granted") { 
            console.log("Notification permission denied");
            return;
        }

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        console.log("Firebase Token: ", token);
    } catch (err) {
        console.log("Firebase Error: ", err);
    }
}

onMessage(messaging, (payload) => {
  console.log("Foreground message:", payload);
});

export default app; 
