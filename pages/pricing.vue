<template>
    <div>
        <section>
            <div class="page-heading">
                <h1 v-motion="$motion(false)" class="page-title"><span>Transparent</span> pricing: choose what works for <span>you</span></h1>
                <p v-motion="$motion(false, 300)" class="page-subtitle">
					Simplify your payments with our convenient <span>subscription</span> plans
                    which provide you <span>control</span> over expenses and usage.
				</p>
            </div>
            <div class="main-grid">
                <ul class="info-list">
                    <li v-motion="$motion(false, 600)" class="info-item">
                        <div class="info-heading">
                            <h2>Join the waitlist now</h2>
                            <p>
                                We are releasing new generators for <span>instagram hashtags, youtube keywords</span> and more soon.
                                Sign up to ensure you won't miss out!
                            </p>
                        </div>
                        <form @submit.prevent="joinWaitlist" class="inputfield">
                            <input v-model="state.email" type="email" name="email" id="email" placeholder="Enter your email address" required>
                            <button type="submit" aria-label="Join the waitlist">
                                <Icon name="fa6-solid:angle-right" size="1.5rem"/>
                            </button>
                        </form>
                        <p v-if="submittedWaitlist" class="success">Your email address was successfully added to the waitlist.</p>
                    </li>
                    <li v-motion="$motion(false, 900)" class="info-item">
                        <h4>Supported payment methods</h4>
                        <div class="payment-methods">
                            <Icon name="logos:visa"/>
                            <Icon name="logos:mastercard"/>
                            <Icon name="logos:amex"/>
                            <Icon name="logos:dinersclub"/>
                            <Icon name="logos:paypal"/>
                            <Icon name="logos:apple-pay"/>
                            <Icon name="logos:google-pay"/>
                        </div>
                    </li>
                </ul>
                <ul v-motion="$motion(false, 600)" class="plan-list">
                    <li v-for="plan in plans" :key="plan" class="plan-item">
                        <div>
                            <div class="plan-heading">
                                <div class="plan-title">
                                    <Icon :name="plan.iconName" size="2rem"/>
                                    <h3>{{ plan.title }}</h3>
                                </div>
                                <v-chip v-if="plan.monthPrice !== 0" color="var(--color-pro)" style="font-weight: bold;">-50%</v-chip>
                            </div>
                            <p class="plan-description">{{ plan.description }}</p>
                        </div>
                        <p class="plan-price">
                            <span v-if="plan.monthPrice !== 0" class="old-plan-price">€{{ Math.round(plan.monthPrice)*2-.01 }}</span>
                            {{ plan.monthPrice === 0 ? "Free" : "&euro;" + plan.monthPrice.toFixed(2) }}
                            <span v-if="plan.monthPrice !== 0" class="plan-pay-interval">/ month</span>
                        </p>
                        <button v-if="plan.monthPrice === 0" @click.prevent="navigateTo('/generator')" class="outlined-btn" aria-label="Try for free">
                            Try for free
                            <Icon name="fa6-solid:arrow-right-long" size="1em"/>
                        </button>
                        <button v-else @click.prevent="subscribe" class="cta-btn" aria-label="Subscribe now">
                            Subscribe now
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
    import { onAuthStateChanged } from "firebase/auth";
    import { doc, getDoc, updateDoc } from "firebase/firestore";
    import { useVuelidate } from "@vuelidate/core";
    import { required, email } from "@vuelidate/validators";

    useHead({
        title: "metagen | Pricing",
    });

    const { $motion } = useNuxtApp();

    const plans = [
        {
            iconName: "fa6-solid:feather",
            title: "Trial",
            description: "Get started for free and upgrade when you're ready for more.",
            monthPrice: 0,
            features: [
                { title: "Preview Image", value: true },
                { title: "Title Generation", value: true },
                { title: "Max Keywords Count", value: 3 },
                { title: "Lifetime Generation Quota", value: 5 },
            ],
        },
        {
            iconName: "fa6-solid:crown",
            title: "Professional",
            description: "Gain exclusive access to enhanced tools and unparalleled support.",
            monthPrice: 7.99,
            features: [
                { title: "Full Access", value: true },
                { title: "Ease of use Perks", value: true },
                { title: "Preview Image", value: true },
                { title: "Title Generation", value: true },
                { title: "Custom Description Length", value: true },
                { title: "Edit Generations", value: true },
                { title: "Persist Generation History", value: true },
                { title: "Max Keywords Count", value: 20 },
                { title: "Monthly Generation Quota", value: 500 },
            ],
        },
    ];

    const { auth, firestore } = useFirebase();

    const isLoggedIn = ref(false);
    const submittedWaitlist = ref(false);
    const state = reactive({email: ""});

    const rules = computed(() => {
        return {email: { required, email }};
    });

    const v$ = useVuelidate(rules, state);

    onAuthStateChanged(auth, () => {
        if (auth.currentUser) {
            isLoggedIn.value = true;
        } else {
            isLoggedIn.value = false;
        }
    });

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

    async function subscribe() {
        const userRef = doc(firestore, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        const subscription = userDoc.data().subscription;

        let paid;
        if (subscription === null) {
            paid = false;
        } else {
            paid = (new Date) < subscription;
        }

        if (auth.currentUser && !paid) {
            const fields = [
                {
                    name: "lookup_key", 
                    value: "price_1NXm9EDrzKjvK8oSzgLkI9sx",
                },
                {
                    name: "user_id",
                    value: auth.currentUser.uid,
                },
            ];

            const form = document.createElement("form");
            form.action = "/api/stripe/subscribe";
            form.method = "POST";

            fields.forEach(field => {
                const formField = document.createElement("input");
                formField.type = "hidden";
                formField.name = field.name;
                formField.value = field.value;
                form.appendChild(formField);
            });

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        } else if (auth.currentUser && paid) {
            navigateTo("/generator");
        } else {
            navigateTo("/auth");
        }
    }
</script>

<style scoped>
    section {
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

    .payment-methods {
        display: flex;
        gap: 1.5rem;
        margin-top: .5rem;
        font-size: 2.5rem;
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

    .plan-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
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

    .old-plan-price {
        position: relative;
        font-size: 1.5rem;
        color: var(--color-text);
    }

    .old-plan-price::after {
        content: "";
        width: 115%;
        height: 3px;
        position: absolute;
        bottom: 40%;
        left: -7.5%;
        border-radius: .5rem;
        background-color: var(--color-red);
    }

    .plan-pay-interval {
        font-size: 1rem;
        color: var(--color-text-alt-dark);
    }

    .plan-item button {
        width: 100%;
    }

    .plan-item:last-child button {
        background: var(--background-pro);
        box-shadow: var(--box-shadow-pro);
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