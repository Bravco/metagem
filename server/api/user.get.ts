import { firestore } from "../utils/firebase";

export default defineEventHandler(async event => {
    const query = getQuery(event);
    const ref = firestore.doc(`users/${query.id}`);
    const snapshot = await ref.get();
    const data = snapshot.data();
    return data;
});