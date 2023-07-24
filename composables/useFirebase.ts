import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const useFirebase = () => {
    const runtimeConfig = useRuntimeConfig();

    const firebaseConfig = {
        "apiKey": runtimeConfig.public.FIREBASE_API_KEY,
        "authDomain": runtimeConfig.public.FIREBASE_AUTH_DOMAIN,
        "projectId": runtimeConfig.public.FIREBASE_PROJECT_ID,
        "storageBucket": runtimeConfig.public.FIREBASE_STORAGE_BUCKET,
        "messagingSenderId": runtimeConfig.public.FIERBASE_MESSAGING_SENDER_ID,
        "appId": runtimeConfig.public.FIREBASE_APP_ID,
        "measurementId": runtimeConfig.public.FIREBASE_MEASUREMENT_ID,
    };

    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);

    return {
        firebaseApp,
        auth,
        firestore,
    };
};