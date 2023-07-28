import { firestore } from "~/server/utils/firebase";
import { getSubscribeUrl } from "~/server/services/stripeService";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    let lookupKey = body.lookup_key;
    if (lookupKey === undefined) {
        lookupKey = JSON.parse(Object.keys(body)[1]).lookup_key;
    }

    let userId = body.user_id;
    if (userId === undefined) {
        userId = JSON.parse(Object.keys(body)[1]).user_id;
    }

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