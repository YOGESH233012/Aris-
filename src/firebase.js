import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCi75EJLnVekpw_paJnl3pR4gYcdWPhLF0",
  authDomain: "aris-aee21.firebaseapp.com",
  projectId: "aris-aee21",
  storageBucket: "aris-aee21.firebasestorage.app",
  messagingSenderId: "61763580628",
  appId: "1:61763580628:web:3413b1acf09bc4a66ec141",
  measurementId: "G-J6NYQ4Q491",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export let analytics = null;

if (typeof window !== "undefined") {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((error) => {
      console.warn("Firebase Analytics not available", error);
    });
}

export let messaging = null;

export const initializeMessaging = async () => {
  try {
    const { isSupported } = await import("firebase/messaging");
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      return messaging;
    }
    return null;
  } catch (error) {
    console.error("Firebase Messaging not supported", error);
    return null;
  }
};

initializeMessaging();
