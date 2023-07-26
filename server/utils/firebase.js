import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as serviceAccount from "./service-account.json";

export const app = initializeApp({
    credential: cert(serviceAccount),
});

export const auth = getAuth();
export const firestore = getFirestore();