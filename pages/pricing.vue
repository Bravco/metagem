<template>
    <div>
        <section>
            <div class="page-heading">
                <h1 class="page-title"><span>Transparent</span> pricing: choose what works for <span>you</span></h1>
                <p class="page-subtitle">
					Simplify your payments with our convenient <span>pay for what you use</span> model.
                    Giving you control over <span>expenses</span> and <span>usage</span>.
				</p>
            </div>
            <div class="main-grid">
                <ul class="info-list">
                    <li class="info-item">
                        <div class="info-heading">
                            <h2>Join the waitlist now</h2>
                            <p>We are releasing new generators for <span>instagram hashtags, youtube keywords</span> and more soon!</p>
                        </div>
                        <form @submit.prevent="joinWaitlist" class="inputfield">
                            <input v-model="state.email" type="email" name="email" id="email" placeholder="Enter your email address" required>
                            <button type="submit" aria-label="Join the waitlist">
                                <Icon name="fa6-solid:angle-right" size="1.5rem"/>
                            </button>
                        </form>
                        <p v-if="submittedWaitlist" class="success">Your email address was successfully added to the waitlist.</p>
                    </li>
                    <li class="info-item">
                        <p>
                            The €5 pending charge you see after updating your payment method is a temporary authorization hold on your credit card.
                            This is part of the process for setting up the pay-as-you-go plan.
                            <b>The pending charge will be reversed within 7 days.</b>
                        </p>
                        <b>If you purchase the professional plan, you will be billed every month based on your generator usage.</b>
                        <div>
                            <h4>Supported card brands</h4>
                            <div class="payment-methods">
                                <Icon name="logos:visa" size="2rem"/>
                                <Icon name="logos:mastercard" size="2rem"/>
                                <Icon name="logos:amex" size="2rem"/>
                                <Icon name="logos:paypal" size="2rem"/>
                                <Icon name="logos:apple-pay" size="2rem"/>
                                <Icon name="logos:google-pay" size="2rem"/>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul class="plan-list">
                    <li v-for="plan in plans" :key="plan" class="plan-item">
                        <div>
                            <div class="plan-title">
                                <Icon :name="plan.iconName" size="2rem"/>
                                <h3>{{ plan.title }}</h3>
                            </div>
                            <p class="plan-description">{{ plan.description }}</p>
                        </div>
                        <p class="plan-price">
                            {{ plan.price === 0 ? "Free" : "&euro;" + plan.price.toFixed(2) }}
                            <span v-if="plan.price !== 0">/ generation</span>
                        </p>
                        <button v-if="plan.price === 0" @click.prevent="navigateTo('/generator')" class="outlined-btn" aria-label="Try for free">
                            Try for free
                            <Icon name="fa6-solid:arrow-right-long" size="1em"/>
                        </button>
                        <button v-else class="cta-btn" aria-label="Buy now">
                            Buy now
                            <Icon name="fa6-solid:money-bill-transfer" size="1.5rem"/>
                        </button>
                        <ul class="features">
                            <li v-for="feature in plan.features" :key="feature" class="feature">
                                <div class="feature-leading">
                                    <p>{{ feature.title }}</p>
                                </div>
                                <div class="feature-trailing">
                                    <Icon v-if="feature.value === true" name="fa6-solid:check" size="1.5rem"/>
                                    <p v-else>{{ feature.value }}</p>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script setup>
    import { doc, getDoc, updateDoc } from "firebase/firestore";
    import { useVuelidate } from "@vuelidate/core";
    import { required, email } from "@vuelidate/validators";

    const plans = [
        {
            iconName: "fa6-solid:feather",
            title: "Trial",
            description: "Get started for free and upgrade when you're ready for more.",
            price: 0,
            features: [
                { title: "Preview Image", value: true },
                { title: "Title Generation", value: true },
                { title: "Max Keywords Count", value: 3 },
                { title: "Daily Generation Quota", value: 2 },
            ],
        },
        {
            iconName: "fa6-solid:crown",
            title: "Professional",
            description: "Gain exclusive access to enhanced tools and unparalleled support.",
            price: 0.50,
            features: [
                { title: "Full Access", value: true },
                { title: "Preview Image", value: true },
                { title: "Title Generation", value: true },
                { title: "Custom Description Length", value: true },
                { title: "Edit Generations", value: true },
                { title: "Preview Code", value: true },
                { title: "Generations History", value: true },
                { title: "Max Keywords Count", value: 20 },
                { title: "Daily Generation Quota", value: "unlimited" },
            ],
        },
    ];

    const { firestore } = useFirebase();

    const submittedWaitlist = ref(false);
    const state = reactive({email: ""});

    const rules = computed(() => {
        return {email: { required, email }};
    });

    const v$ = useVuelidate(rules, state);

    async function joinWaitlist() {
        const valid = await v$.value.$validate();

        if (valid) {
            const waitlistRef = doc(firestore, "data", "waitlist");

            getDoc(waitlistRef).then((doc) => {
                if (!doc.data().emails.includes(state.email)) {
                    updateDoc(doc.ref, {
                        emails: [...doc.data().emails, state.email],
                    });
                }
            });

            submittedWaitlist.value = true;
            setTimeout(() => {
                submittedWaitlist.value = false;
            }, 3000);
        }
    }
</script>

<style scoped>
    section {
        --color-pro: rgb(123, 87, 255);
        --color-pro-50: rgba(123, 87, 255, .5);
        --color-pro-25: rgba(123, 87, 255, .25);

        gap: 4rem;
    }

	.page-title {
		width: 70%;
	}

	.page-subtitle {
		width: 60%;
	}

    .main-grid {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }

    .info-list, .plan-list {
        display: grid;
        gap: 2rem;
    }

    .info-item:first-child, .plan-item {
        border-radius: .5rem;
        background-color: var(--color-background-secondary);
    }

    .info-list {
        grid-template-rows: repeat(2, 1fr);
    }

    .info-item:first-child {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 2rem;
    }

    .info-heading {
        text-align: center;
    }

    .info-heading span {
        font-weight: bold;
        color: var(--color-primary);
    }

    .success {
        color: var(--color-primary);
    }

    .info-item:first-child .inputfield {
        width: 80%;
        position: relative;
    }

    .info-item:first-child .inputfield input {
        width: 100%;
        padding: 1rem 2rem;
        font-size: 1.25rem;
        border-radius: 8rem;
        background-color: white;
    }

    .info-item:first-child .inputfield button {
        width: 3rem;
        height: 3rem;
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        color: white;
        background-color: var(--color-primary);
        border-radius: 50%;
    }

    .info-item:last-child {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .payment-methods {
        display: flex;
        gap: 1rem;
        margin-top: .5rem;
    }

    .plan-list {
        grid-template-columns: repeat(2, 1fr);
    }

    .plan-item {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }

    .plan-item:last-child {
        background-color: var(--color-pro-25);
    }

    .plan-title {
        display: flex;
        align-items: center;
        gap: .5rem;
    }

    .plan-title .icon {
        color: var(--color-primary-alt);
    }

    .plan-item:last-child .plan-title .icon {
        color: var(--color-pro-50);
    }

    .plan-description {
        color: var(--color-text-alt-dark);
    }

    .plan-price {
        font-size: 3rem;
        font-weight: bold;
        color: var(--color-primary);
    }

    .plan-item:last-child .plan-price {
        color: var(--color-pro);
    }

    .plan-price span {
        font-size: 1rem;
        color: var(--color-text-alt-dark);
    }

    .plan-item button {
        width: 100%;
    }

    .plan-item:last-child button {
        background: linear-gradient(135deg, #D357FF 5.73%, #7B57FF 35.42%, #4B1EFF 70.31%, #2400FF 100%);
        box-shadow: 0px 4px 20px 0px #7B57FF;
    }

    .features {
        display: grid;
        gap: 1rem;
        padding: 1rem;
    }

    .feature {
        display: grid;
        grid-template-columns: 5fr 1fr;
        position: relative;
    }

    .feature:not(:last-child)::after {
		content: "";
		width: calc(100% + 1rem);
		height: 2px;
		position: absolute;
		right: -.5rem;
		bottom: -.5rem;
		background-color: var(--color-background-primary);
	}

    .feature-trailing {
        display: grid;
        place-items: center;
        font-weight: bold;
    }

    .feature-trailing .icon {
        color: var(--color-primary);
    }

    .plan-item:last-child .feature-trailing .icon {
        color: var(--color-pro);
    }

    @media only screen and (max-width: 1480px) {
        .main-grid {
            grid-template-columns: 1fr;
        }
    }

    @media only screen and (max-width: 768px) {
        .plan-list {
            grid-template-columns: 1fr;
        }
    }
</style>