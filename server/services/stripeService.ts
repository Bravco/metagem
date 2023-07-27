import Stripe from "stripe";
import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "../utils/firebase";
import { stripe } from "../utils/stripe";
import { SubPostRes } from "../types/SubPostRes";

const config = useRuntimeConfig();

export async function getSubscribeUrl(lookupKey: string, user: any): Promise<SubPostRes> {
    const userEmail = user.email;
    const userStripeCustomerId = user.stripeCustomerId ?? null;
    const price = await stripe.prices.retrieve(lookupKey);

    let shouldUpdateUser = false;

    if (!userStripeCustomerId) {
        shouldUpdateUser = true;
        const customer = await stripe. customers.create({ email: userEmail });
        user.stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
        billing_address_collection: "auto",
        line_items: [
            {
                price: price.id,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${config.public.APP_DOMAIN}`,
        cancel_url: `${config.public.APP_DOMAIN}`,
        customer: user.stripeCustomerId,
    });

    return { url: session.url!, stripeCustomerId: user.stripeCustomerId, shouldUpdateUser };
}

export async function deleteCustomer(customerId: string): Promise<any> {
    const querySnapshot = await firestore.collection("/users").where("stripeCustomerId", "==", customerId).get();
    querySnapshot.docs.forEach(doc => {
        doc.ref.update({
            stripeCustomerId: FieldValue.delete(),
            subscription: FieldValue.delete(),
        });
    });
}

export async function updateSubscription(subscription: Stripe.Subscription): Promise<any> {
    const querySnapshot = await firestore.collection("/users").where("stripeCustomerId", "==", subscription.customer).get();
    querySnapshot.docs.forEach(doc => {
        if (subscription) {
            doc.ref.update({
                subscription: new Date(subscription.current_period_end * 1000),
            });
        }
    });
}

export async function deleteSubscription(subscription: Stripe.Subscription): Promise<any> {
    const querySnapshot = await firestore.collection("/users").where("stripeCustomerId", "==", subscription.customer).get();
    querySnapshot.docs.forEach(doc => {
        doc.ref.update({
            subscription: FieldValue.delete(),
        });
    });
}

export async function refreshGenerationsCount(invoice: Stripe.Invoice): Promise<any> {
    const querySnapshot = await firestore.collection("/users").where("stripeCustomerId", "==", invoice.customer).get();
    querySnapshot.docs.forEach(doc => {
        doc.ref.update({
            generationsCount: 0,
        });
    });
}