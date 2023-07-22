<template>
    <div>
        <div class="wrapper">
            <nuxt-img class="auth-img" src="images/auth.webp" alt="auth-image"/>
            <div class="auth-wrapper">
                <div v-if="forgotPassword" class="auth-container">
                    <div >
                        <h3>Password <span>recovery</span></h3>
                        <p class="auth-subtitle">Reset your password to regain control of your account safely and securely</p>
                    </div>
                    <form @submit.prevent="resetPassword">
                        <div class="inputfield">
                            <label for="email">Email</label>
                            <input v-model="state.email" id="email" name="email" type="email" required>
                        </div>
                        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
                        <p v-if="successMsg" class="success">{{ successMsg }}</p>
                        <div class="auth-btn-wrapper">
                            <button class="btn" type="submit" aria-label="Sign up">Sign up</button>
                            <p>Remember password? <a @click.prevent="toggleForgotPassword" class="auth-link" aria-label="Switch to sign in">Sign in</a></p>
                        </div>
                    </form>
                </div>
                <div v-else class="auth-container">
                    <div v-if="isSigningUp">
                        <h3>Register for <span>free</span></h3>
                        <p class="auth-subtitle">Sign up now to unlock exclusive features of metagen.</p>
                    </div>
                    <div v-else>
                        <h3><span>Welcome</span> back!</h3>
                        <p class="auth-subtitle">Sign in to access your account and pick up where you left off.</p>
                    </div>
                    <form v-if="isSigningUp" @submit.prevent="signUp">
                        <div class="inputfield">
                            <label for="email">Email</label>
                            <input v-model="state.email" id="email" name="email" type="email" required>

                            <div v-if="submitted" class="validation">
                                <p v-if="v$.email.email.$invalid">Not a valid email address</p>
                            </div>
                        </div>
                        <div class="inputfield">
                            <label for="password">Password</label>
                            <input v-model="state.password" id="password" name="password" type="password" minlength="6" required>
                        
                            <div v-if="submitted" class="validation">
                                <p v-if="v$.password.minLength.$invalid">At least 6 characters</p>
                            </div>
                        </div>
                        <div class="inputfield">
                            <label for="confirm-password">Confirm password</label>
                            <input v-model="state.confirmPassword" id="confirm-password" name="confirm-password" type="password" minlength="6" required>
                        
                            <div v-if="submitted" class="validation">
                                <p v-if="v$.confirmPassword.sameAsPassword.$invalid">Passwords don't match</p>
                            </div>
                        </div>
                        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
                        <div class="auth-btn-wrapper">
                            <button class="btn" type="submit" aria-label="Sign up">Sign up</button>
                            <p>Already have an account? <a @click.prevent="toggleIsSigningUp" class="auth-link" aria-label="Switch to sign in">Sign in</a></p>
                        </div>
                    </form>
                    <form v-else @submit.prevent="signIn">
                        <div class="inputfield">
                            <label for="email">Email</label>
                            <input v-model="state.email" id="email" name="email" type="email" required>
                        </div>
                        <div class="inputfield">
                            <label for="password">Password</label>
                            <input v-model="state.password" id="password" name="password" type="password" minlength="6" required>
                        </div>
                        <a @click.prevent="toggleForgotPassword" class="auth-link-align-end auth-link" aria-label="Forgot password">Forgot password</a>
                        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
                        <div class="auth-btn-wrapper">
                            <button class="btn" type="submit" aria-label="Sign in">Sign in</button>
                            <p>Create an account? <a @click.prevent="toggleIsSigningUp" class="auth-link" aria-label="Switch to sign up">Sign up</a></p>
                        </div>
                    </form>
                    <div class="divider">or</div>
                    <button @click="signInWithGoogle" class="google-btn outlined-btn" aria-label="Log in with Google">
                        <Icon name="logos:google-icon"/>
                        Log in with Google
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    import { doc, updateDoc } from "firebase/firestore";
    import { useVuelidate } from "@vuelidate/core";
    import { required, minLength, email, sameAs } from "@vuelidate/validators";

    useHead({
        title: "metagen | Auth",
    });

    definePageMeta({
        middleware: ["auth"],
    });

    const { auth, firestore } = useFirebase();
    const googleProvider = new GoogleAuthProvider();

    const isSigningUp = ref(false);
    const forgotPassword = ref(false);

    const submitted = ref(false);
    const errorMsg = ref("");
    const successMsg = ref("");

    const state = reactive({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const rules = computed(() => {
        return {
            email: { required, email },
            password: { required, minLength: minLength(6) },
            confirmPassword: { required, sameAsPassword: sameAs(state.password) },
        }
    });

    const v$ = useVuelidate(rules, state);

    function clearInput() {
        submitted.value = false;
        errorMsg.value = "";
        successMsg.value = "";
        state.email = "";
        state.password = "";
        state.confirmPassword = "";
    }

    function toggleIsSigningUp() {
        clearInput();
        isSigningUp.value = !isSigningUp.value;
    }

    function toggleForgotPassword() {
        forgotPassword.value = !forgotPassword.value;
    }

    async function signUp() {
        const valid = await v$.value.$validate();
        submitted.value = true;

        if (valid) {
            if (auth.currentUser) {
                signOut(auth);
            }
            createUserWithEmailAndPassword(auth, state.email, state.password).then(async (result) => {
                const userRef = doc(firestore, "users", result.user.uid);
                
                await updateDoc(userRef, {
                    uid: result.user.uid,
                    email: result.user.email,
                    paid: false,
                });

                sendEmailVerification(auth.currentUser);
                navigateTo("/generator");
            }).catch((error) => {
                switch (error.code) {
                    case "auth/email-already-in-use":
                        errorMsg.value = "This email address is taken";
                        break;

                    default:
                        errorMsg.value = "Something went wrong";
                        break;
                }
            });
        }
    }

    function signIn() {
        if (auth.currentUser) {
            signOut(auth);
        }

        signInWithEmailAndPassword(auth, state.email, state.password).then(() => {
            navigateTo("/generator");
        }).catch((error) => {
            switch (error.code) {
                case "auth/invalid-email":
                    errorMsg.value = "Invalid email address";
                    break;
                
                case "auth/user-not-found":
                    errorMsg.value = "No account with that email was found";
                    break;
            
                case "auth/wrong-password":
                    errorMsg.value = "Incorrect password";
                    break;

                default:
                    errorMsg.value = "Email or password was incorrect";
                    break;
            }
        });
    }

    function signInWithGoogle() {
        if (auth.currentUser) {
            signOut(auth);
        }

        signInWithPopup(auth, googleProvider).then(async (result) => {
            const userRef = doc(firestore, "users", result.user.uid);
                
            await updateDoc(userRef, {
                uid: result.user.uid,
                email: result.user.email,
                paid: false,
            });

            navigateTo("/generator");
        });
    }

    function resetPassword() {
        sendPasswordResetEmail(auth, state.email).then(() => {
            successMsg.value = "Password recovery email was sent to provided email address";
        }).catch((error) => {
            switch (error.code) {
                case "auth/invalid-email":
                    errorMsg.value = "Invalid email";
                    break;
                
                case "auth/user-not-found":
                    errorMsg.value = "No account with that email was found";
                    break;

                default:
                    errorMsg.value = "Something went wrong";
                    break;
            }
        });
    }
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
        width: 30rem;
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

    .auth-link-align-end {
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

    .validation, .error {
        color: var(--color-red);
    }

    .success {
        color: var(--color-primary);
    }

    @media only screen and (max-width: 768px) {
        .auth-container {
            width: 90%;
        }
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