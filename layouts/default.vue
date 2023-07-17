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
                <button @click.prevent="navigateTo('/generator')" class="cta-btn">
                    Start for free
                    <Icon name="fa6-solid:arrow-right-long"/>
                </button>
            </nav>
        </header>
        <main>
            <slot/>
        </main>
    </div>
</template>

<style scoped>
    nav {
        width: 100vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 5%;
        z-index: 100;
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