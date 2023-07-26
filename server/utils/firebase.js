import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const config = useRuntimeConfig();

const serviceAccount = {
    "type": config.private.FIREBASE_TYPE,
    "project_id": config.public.FIREBASE_PROJECT_ID,
    "private_key_id": config.private.FIREBASE_PRIVATE_KEY_ID,
    "private_key": config.private.FIREBASE_PRIVATE_KEY,
    "client_email": config.private.FIREBASE_CLIENT_EMAIL,
    "client_id": config.private.FIREBASE_CLIENT_ID,
    "auth_uri": config.private.FIREBASE_AUTH_URI,
    "token_uri": config.private.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": config.private.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": config.private.FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": config.private.FIREBASE_UNIVERSE_DOMAIN,
};

export const app = initializeApp({
    credential: cert(serviceAccount),
});

export const auth = getAuth();
export const firestore = getFirestore();