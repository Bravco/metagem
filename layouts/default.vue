<template>
    <div>
        <header>
            <nav>
                <Logo class="logo" :interactable="true"/>
                <ul :class="['nav-list', {'active' : isMobileMenuActive}]">
                    <li class="nav-item">
                        <NuxtLink class="nav-link" to="/">Home</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link" to="/pricing">Pricing</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link" to="/generator">Generator</NuxtLink>
                    </li>
                </ul>                
                <div class="right">
                    <button @click.prevent="toggleMobileMenu" :class="['hamburger', {'active' : isMobileMenuActive}]" aria-label="Open mobile navigation">
                        <span class="bar"></span>
                    </button>
                    <div v-if="isLoggedIn && auth.currentUser" class="dropdown">
                        <button @click.prevent="toggleDropdown" class="dropdown-toggle-btn" aria-label="Toggle dropdown">
                            <img v-if="photoURL" class="profile-picture" :src="photoURL" alt="profile-picture">
                            <div v-else class="profile-picture-placeholder">
                                <Icon name="fa6-solid:user" size="1.25rem"/>
                            </div>
                        </button>
                        <ul :class="['dropdown-content', {'active' : isDropdownActive}]">
                            <li class="dropdown-item">
                                <div>
                                    <p class="dropdown-item-label">Logged as</p>
                                    <b>{{ auth.currentUser.email }}</b>
                                </div>
                                <v-chip :color="paid ? 'var(--color-pro)' : 'var(--color-primary)'">{{ paid ? 'Pro' : 'Free' }}</v-chip>
                            </li>
                            <hr>
                            <li v-if="paid" class="dropdown-item">
                                <div>
                                    <p class="dropdown-item-label">
                                        Subscription expiration date
                                    </p>
                                    <b v-if="subscription !== null">
                                        {{ subscription.getUTCDate() }}
                                        {{ monthNames[subscription.getUTCMonth()] }}
                                        {{ subscription.getUTCFullYear() }}
                                    </b>
                                </div>
                            </li>
                            <li class="dropdown-item">
                                <button v-if="paid" @click.prevent="manageSubscription" class="btn" ria-label="Manage subscription">
                                    Manage subscription
                                </button>
                                <button v-else @click="navigateTo('/pricing')" class="btn" aria-label="Upgrade to Pro">
                                    Upgrade to Pro
                                </button>
                            </li>
                            <hr>
                            <li class="dropdown-item">
                                <button @click="logout" class="dropdown-btn" aria-label="Sign out">
                                    Sign out
                                    <Icon name="fa6-solid:arrow-right-from-bracket"/>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <button v-else @click.prevent="navigateTo('/auth')" class="btn">
                        Sign in
                        <Icon name="fa6-solid:arrow-right-to-bracket"/>
                    </button>
                </div>
            </nav>
        </header>
        <main>
            <slot/>
        </main>
        <footer>
            <Logo/>
            <ul class="nav-list">
                <li>
                    <NuxtLink to="/privacy">Privacy Policy</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/tos">Terms of Service</NuxtLink>
                </li>
            </ul>
            <p>&copy; 2023 metagen | All rights reserved</p>
        </footer>
    </div>
</template>

<script setup>
    import { signOut, onAuthStateChanged } from 'firebase/auth';
    import { doc, onSnapshot } from 'firebase/firestore';

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const { afterEach } = useRouter();
    const { auth, firestore } = useFirebase();

    const isLoggedIn = ref(false);
    const photoURL = ref(null);
    const subscription = ref(null);
    const isMobileMenuActive = ref(false);
    const isDropdownActive = ref(false);

    const paid = computed(() => {
        if (subscription.value === null) {
            return false;
        } else {
            return (new Date) < subscription.value;
        }
    });

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            photoURL.value = auth.currentUser.photoURL;

            const userRef = doc(firestore, "users", user.uid);
            isLoggedIn.value = true;
            onSnapshot(userRef, (snapshot) => {
                if (snapshot.data().subscription) {
                    subscription.value = snapshot.data().subscription.toDate();
                }
            });
        } else {
            isLoggedIn.value = false;
        }
    });

    afterEach(() => {
        isMobileMenuActive.value = false;
        isDropdownActive.value = false;
    });

    function toggleMobileMenu() {
        isMobileMenuActive.value = !isMobileMenuActive.value;
    }

    function toggleDropdown() {
        isDropdownActive.value = !isDropdownActive.value;
    }

    function logout() {
        signOut(auth);
        navigateTo("/");
    }

    function handleDropdown(event) {
		if (process.client) {
            const dropdownContent = document.querySelector(".dropdown-content");
            if (dropdownContent && !event.target.closest(".dropdown")) {
                isDropdownActive.value = false;
            }
		}
	}

    function manageSubscription() {
        if (auth.currentUser) {
            const fields = [
                {
                    name: "user_id",
                    value: auth.currentUser.uid,
                },
            ];

            const form = document.createElement("form");
            form.action = "/api/stripe/manageSubscription";
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
        }
    }

	onMounted(() => {
		if (process.client) {
			window.addEventListener("click", handleDropdown);
		}
	});

	onUnmounted(() => {
		if (process.client) {
			window.removeEventListener("click", handleDropdown);
		}
	});
</script>

<style scoped>
    nav, footer {
        width: 100vw;
        display: grid;
        grid-template-columns: 1fr 5fr 1fr;
        place-items: center;
    }

    nav {
        position: fixed;
        top: 0;
        padding: 1rem 10%;
        z-index: 100;
        background-color: var(--color-background-primary);
    }

    .nav-list {
        display: flex;
        gap: 5rem;
    }

    .nav-item {
        font-size: 1.125rem;
        font-weight: 500;
    }

    .nav-link {
        position: relative;
    }

    .nav-link:hover::after {
        animation: underline 200ms ease-in-out forwards;
    }

    .nav-link::after {
        content: "";
        height: 2px;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: var(--color-primary);
    }

    nav .right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-toggle-btn {
        display: grid;
        place-items: center;
    }

    .profile-picture, .profile-picture-placeholder {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
    } 

    .profile-picture {
        object-fit: cover;
        object-position: center;
    }

    .profile-picture-placeholder {
        display: grid;
        place-items: center;
        color: var(--color-text-alt-dark);
        background-color: var(--color-background-secondary);
    }

    .dropdown-content {
        display: none;
        gap: 1rem;
        position: absolute;
        right: 0;
        margin-top: .5rem;
        padding: 1rem 0;
        background-color: var(--color-background-primary);
        border-radius: .5rem;
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, .1);
        min-width: 16rem;
    }
    
    .dropdown-content.active {
        display: grid;
    }

    .dropdown-item, .dropdown-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .dropdown-item {
        gap: 1rem;
        padding: 0 1rem;
    }

    .dropdown-item button {
        width: 100%;
    }

    .dropdown-icon-btn {
        border: 2px solid var(--color-text-alt-light);
        color: var(--color-text-alt-dark);
        background-color: unset;
    }

    .dropdown-item-label {
        color: var(--color-text-alt-dark);
        font-size: .8rem;
    }

    .hamburger {
        display: none;
    }

    footer {
        padding: 1rem 10% 2rem 10%;
    }

    footer p {
        font-weight: bold;
        font-size: .75rem;
    }

    .router-link-exact-active {
        color: var(--color-primary);
    }

    @media only screen and (max-width: 1024px) {
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-list {
            width: 100%;
            height: 100vh;
            opacity: 0;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
            transition-property: opacity, background-color, backdrop-filter;
            transition-duration: 300ms;
        }

        .nav-list.active {
            opacity: 1;
            background-color: rgba(0, 0, 0, .25);
            backdrop-filter: blur(.5rem);
        }

        .nav-list:not(.active) {
            pointer-events: none;
        }

        nav:has(.nav-list.active) {
            background-color: unset;
            backdrop-filter: unset;
            transition-property: background-color;
            transition-duration: 300ms;
        }

        .nav-item {
            width: fit-content;
            font-size: 3rem;
            font-weight: bold;
            text-shadow: white 1px 0 20px;
        }
        
        .nav-link:hover::after {
            animation: none;
        }

        .logo, .hamburger {
            z-index: 1;
        }

        .hamburger {
            width: 2rem;
            height: 2rem;
            display: block;
            position: relative;
        }

        .hamburger .bar, .hamburger::after, .hamburger::before {
            content: "";
            width: 100%;
            height: .25rem;
            display: block;
            margin: 6px 0;
            background-color: var(--color-text);
            border-radius: .25rem;
            transition: all 300ms;
        }

        .hamburger:not(.active):hover .bar {
            background-color: var(--color-primary);
            transform: translate(8px);
        }

        .hamburger.active .bar {
            opacity: 0;
        }

        .hamburger.active::before {
            transform: rotate(-45deg) translate(-7px, 7px);
        }

        .hamburger.active::after {
            transform: rotate(45deg) translate(-7px, -7px);
        }
    }

    @keyframes underline {
        from {
            width: 0;
        }

        to {
            width: 100%;
        }
    }
</style>