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
                        <NuxtLink class="nav-link" to="/generator">Generator</NuxtLink>
                    </li>
                </ul>                
                <div class="left">
                    <button @click.prevent="navigateTo('/auth')" class="btn">
                        Sign up
                        <Icon name="fa6-solid:arrow-right"/>
                    </button>
                    <button @click.prevent="toggleMobileMenu" :class="['hamburger', {'active' : isMobileMenuActive}]" aria-label="Open mobile navigation">
                        <span class="bar"></span>
                    </button>
                </div>
            </nav>
        </header>
        <main>
            <slot/>
        </main>
        <footer>
            <Logo/>
            <p>&copy; 2023 metagen | All rights reserved</p>
        </footer>
    </div>
</template>

<script setup>
    const { afterEach } = useRouter();
    const isMobileMenuActive = ref(false);

    afterEach(() => {
        isMobileMenuActive.value = false;
    });

    function toggleMobileMenu() {
        isMobileMenuActive.value = !isMobileMenuActive.value;
    }
</script>

<style scoped>
    nav, footer {
        width: 100vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 10%;
    }

    nav {
        position: fixed;
        top: 0;
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

    nav .left {
        display: flex;
        gap: 1rem;
    }

    .hamburger {
        display: none;
    }

    footer p {
        font-weight: bold;
        font-size: .75rem;
    }

    .router-link-exact-active {
        color: var(--color-primary);
    }

    @media only screen and (max-width: 768px) {
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