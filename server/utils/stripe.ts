import Stripe from "stripe";

const config = useRuntimeConfig();
export const stripe = new Stripe(config.private.STRIPE_API_KEY, null!);