<template>
    <div>
        <NuxtLink class="logo" to="/" :class="{ disabled: !interactable }">
            <Icon class="icon" name="fa6-solid:gem"/>
            Metagem<span>.</span>
        </NuxtLink>
    </div>
</template>

<script setup>
    const props = defineProps({
        interactable: {
            type: Boolean,
            default: false,
        }
    });
</script>

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

    .disabled {
        pointer-events: none;
    }

    @media only screen and (max-width: 384px) {
        .logo {
            font-size: 1.5rem;
        }
    }
</style>