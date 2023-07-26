import { stripe } from "../../utils/stripe";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const sessionId = body.session_id;

    const returnUrl = config.public.APP_DOMAIN;

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: checkoutSession.customer as string,
        return_url: returnUrl,
    });

    await sendRedirect(event, portalSession.url);
});