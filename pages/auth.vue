<template>
    <div>
        <div class="wrapper">
            <nuxt-img class="auth-img" src="images/auth.webp" alt="auth-image"/>
            <div class="auth-wrapper">
                <div class="auth-container">
                    <div v-if="usingSignUpForm">
                        <h3>Register for <span>free</span></h3>
                        <p class="auth-subtitle">Sign up now to unlock exclusive features of metagen.</p>
                    </div>
                    <div v-else>
                        <h3><span>Welcome</span> back!</h3>
                        <p class="auth-subtitle">Sign in to access your account and pick up where you left off.</p>
                    </div>
                    <form v-if="usingSignUpForm" @submit.prevent="">
                        <div class="inputfield">
                            <label for="email">Email</label>
                            <input id="email" name="email" type="email">
                        </div>
                        <div class="inputfield">
                            <label for="password">Password</label>
                            <input id="password" name="password" type="password">
                        </div>
                        <div class="inputfield">
                            <label for="repeat-password">Repeat password</label>
                            <input id="repeat-password" name="repeat-password" type="password">
                        </div>
                        <div class="auth-btn-wrapper">
                            <button class="btn" type="submit" aria-label="Sign up">Sign up</button>
                            <p>Already have an account? <button @click.prevent="usingSignUpForm = false" class="auth-link" aria-label="Switch to sign in">Sign in</button></p>
                        </div>
                    </form>
                    <form v-else @submit.prevent="">
                        <div class="inputfield">
                            <label for="email">Email</label>
                            <input id="email" name="email" type="email">
                        </div>
                        <div class="inputfield">
                            <label for="password">Password</label>
                            <input id="password" name="password" type="password">
                        </div>
                        <a class="forgot-password auth-link">Forgot password</a>
                        <div class="auth-btn-wrapper">
                            <button class="btn" type="submit" aria-label="Sign in">Sign in</button>
                            <p>Create an account? <button @click.prevent="usingSignUpForm = true" class="auth-link" aria-label="Switch to sign up">Sign up</button></p>
                        </div>
                    </form>
                    <div class="divider">or</div>
                    <button class="google-btn outlined-btn" aria-label="Log in with Google">
                        <Icon name="logos:google-icon"/>
                        Log in with Google
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    //import { doc, onSnapshot } from "firebase/firestore";

    useHead({
        title: "metagen | Auth",
    });

    const usingSignUpForm = ref(false);

    /*const { firestore } = useFirebase();
    const data = ref(null);

    onMounted(() => {
        const userDoc = doc(firestore, "users", "8oVLFA1sNFRTDGAE65WCKPClByu2");
        onSnapshot(userDoc, snapshot => {
            data.value = snapshot.data();
        });
    });*/
</script>

<style scoped>
    .wrapper {
        height: calc(100vh - 5rem);
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }

    .auth-img {
        width: 100%;
        height: calc(100vh - 5rem);
        object-fit: cover;
        object-position: bottom;
    }

    .auth-wrapper {
        display: grid;
        place-items: center;
    }

    .auth-container {
        display: grid;
        gap: 2rem;
        padding: 2rem;
        border-radius: .5rem;
        background-color: var(--color-background-secondary);
    }

    .auth-subtitle {
        font-size: 1.125rem;
        color: var(--color-text-alt-dark);
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .inputfield {
        display: grid;
    }

    .inputfield input {
        padding: .5rem;
        border-radius: .5rem;
        background-color: var(--color-background-primary);
    }

    .auth-link {
        color: var(--color-primary);
        text-decoration: underline;
    }

    .forgot-password {
        align-self: flex-end;
    }

    .auth-btn-wrapper {
        display: grid;
        place-items: center;
        gap: .5rem;
    }

    .auth-btn-wrapper .btn {
        width: 100%;
    }

    .divider {
        width: 100%;
        text-align: center;
        position: relative;
        color: var(--color-text-alt-light);
    }

    .divider::before, .divider::after {
        content: "";
        width: calc(50% - 1rem);
        height: 2px;
        position: absolute;
        top: 50%;
        background-color: var(--color-text-alt-light);
    }

    .divider::before {
        left: 0;
    }

    .divider::after {
        right: 0;
    }

    .google-btn {
        width: 100%;
        border-width: 1px;
        font-weight: normal;
    }

    @media only screen and (max-width: 1024px) {
        .wrapper {
            grid-template-columns: unset;
        }

        .auth-img {
            display: none;
        }
    }
</style>