import Stripe from "stripe";
import { deleteCustomer, updateSubscription, deleteSubscription } from "../../services/stripeService";

export default defineEventHandler(async (event) => {
    const stripeEvent = await readBody<Stripe.Event>(event);

    let customer: Stripe.Customer | undefined;
    let subscription: Stripe.Subscription | undefined;

    switch (stripeEvent.type) {
        case "customer.deleted":
            customer = stripeEvent.data.object as Stripe.Customer;
            deleteCustomer(customer.id);
            break;

        case "customer.subscription.created":
        case "customer.subscription.updated":
            subscription = stripeEvent.data.object as Stripe.Subscription;
            updateSubscription(subscription);
            break;
        
        case "customer.subscription.deleted":
            subscription = stripeEvent.data.object as Stripe.Subscription;
            deleteSubscription(subscription);
            break;
        
        default:
            console.log(`Unhandled ${stripeEvent.type}`);
            break;
    }

    return `Handled ${stripeEvent.type}`;
});