/// <reference lib="webworker" />
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

declare let self: ServiceWorkerGlobalScope;

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

precacheAndRoute(self.__WB_MANIFEST);

onBackgroundMessage(messaging, (payload) => {
    console.log("[SW] Background message: ", payload);

    const title = payload.notification?.title || payload.data?.title || "Notification";
    const body = payload.notification?.body || payload.data?.body || "";

    self.registration.showNotification(
        title,
        {
            body: body
        }
    )
})

registerRoute(
    ({request, url}) => request.mode === "navigate" && !url.pathname.startsWith("/api"),
    createHandlerBoundToURL("/index.html") 
)

registerRoute(
    ({request}) => 
        request.destination === "script" ||
        request.destination === "style",
    new CacheFirst({
        cacheName: "static-assets",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30
            }),
        ]
    })
);

registerRoute(
    ({request}) => request.destination === "image",
    new CacheFirst({
        cacheName: "images",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
            }),
        ]
    })
)

registerRoute(
    ({url}) => url.pathname.startsWith("/api"),
    new NetworkFirst({
        cacheName: "api-cache",
        networkTimeoutSeconds: 5,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 5
            })
        ]
    })
)