<template>
    <div>
        <header>
            <nav>
                <Logo/>
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
</style>