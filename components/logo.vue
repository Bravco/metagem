<template>
    <div>
        <NuxtLink class="logo" to="/">
            <Icon class="icon" name="fa6-solid:brain"/>
            metagen<span>.</span>
        </NuxtLink>
    </div>
</template>

<style scoped>
    .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
    }

    .logo span, .icon {
        color: var(--color-primary);
    }

    .icon {
        margin-right: .5rem;
    }
</style>