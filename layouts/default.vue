<template>
    <div>
        <header>
            <nav>
                <Logo/>
                <ul class="nav-list">
                    <li class="nav-item">
                        <ClientOnly>
                            <NuxtLink to="/">Home</NuxtLink>
                        </ClientOnly>
                    </li>
                    <li class="nav-item">
                        <ClientOnly>
                            <NuxtLink to="/app">App</NuxtLink>
                        </ClientOnly>
                    </li>
                </ul>
                <button @click.prevent="navigateTo('/app')" class="cta-btn">
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

    .router-link-exact-active {
        color: var(--color-primary);
    }
</style>