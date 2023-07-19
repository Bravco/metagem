<template>
    <div>
        <header>
            <nav>
                <Logo :interactable="true"/>
                <ul class="nav-list">
                    <li class="nav-item">
                        <NuxtLink class="nav-link" to="/">Home</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link" to="/generator">Generator</NuxtLink>
                    </li>
                </ul>
                <button @click.prevent="navigateTo('/generator')" class="btn">
                    Sign up
                    <Icon name="fa6-solid:arrow-right"/>
                </button>
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

<style scoped>
    nav, footer {
        width: 100vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 5%;
    }

    nav {
        position: fixed;
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

    footer p {
        font-weight: bold;
        font-size: .75rem;
    }

    .router-link-exact-active {
        color: var(--color-primary);
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