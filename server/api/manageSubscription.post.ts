import { firestore } from "~/server/utils/firebase";
import { stripe } from "~/server/utils/stripe";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const userId = body.user_id;
    
    const userRef = await firestore.collection("/users").doc(userId).get();
    const customerId = userRef.data()!.stripeCustomerId;

    const returnUrl = config.public.APP_DOMAIN;

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });

    await sendRedirect(event, portalSession.url);
});