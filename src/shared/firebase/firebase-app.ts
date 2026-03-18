import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { registerFirebaseToken } from "./api/registerFirebaseToken";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const isDev = import.meta.env.DEV;

export async function initPushNotifications() {
  try {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service workers not supported");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    let token: string | null = null;

    if (!isDev) {
      const registration = await navigator.serviceWorker.ready;

      token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if(token) {
        await registerFirebaseToken(token);
        console.log("Firebase Token registered with backend");
      }
    } else {
      token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
    }

    console.log("Firebase Token:", token);
  } catch (err) {
    console.error("Firebase Error:", err);
  }
}
export function setupForegroundMessageListener() {
    const unsubscribe = onMessage(messaging, (payload) => {
        if (Notification.permission !== "granted") return;

        const title =
            payload.notification?.title ||
            payload.data?.title ||
            "Notification";

        const body =
            payload.notification?.body ||
            payload.data?.body ||
            "";

        new Notification(title, { body });
    });

    console.log("Foreground message listener set up");

    return unsubscribe;
}


export default app;