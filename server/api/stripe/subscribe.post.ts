import { firestore } from "../../utils/firebase";
import { getSubscribeUrl } from "~/server/services/stripeService";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const lookupKey = body.lookup_key;
    const userId = body.user_id;

    const userRef = firestore.doc(`users/${userId}`);
    const userSnapshot = await userRef.get();
    const userData = userSnapshot.data();

    const { url, stripeCustomerId, shouldUpdateUser } = await getSubscribeUrl(lookupKey, userData);

    if (shouldUpdateUser) {
        userRef.update({
            stripeCustomerId: stripeCustomerId,
        });
    }
    
    await sendRedirect(event, url);
});