<template>
    <NuxtLayout>
        <div>
            <section v-motion="$motion(false)">
                <div class="text">
                    <div class="page-heading">
                        <h1 class="page-title"><span>{{ error.statusCode }}</span> Ooops...</h1>
                        <p class="page-subtitle">{{ error.message }}</p>
                    </div>
                    <button @click="navigateTo('/')" class="btn">
                        <Icon name="fa6-solid:arrow-left-long"/>
                        Return home
                    </button>
                </div>
                <nuxt-img class="error-img" src="images/robot-error.svg" alt="error-image"/>
            </section>
        </div>
    </NuxtLayout>
</template>

<script setup>
    defineProps(["error"]);

    const { $motion } = useNuxtApp();
</script>

<style scoped>
    section {
        grid-template-columns: repeat(2, 1fr);
        place-items: unset;
        align-items: center;
        gap: unset;
    }

    .text {
        height: fit-content;
        display: grid;
        gap: 2rem;
    }

    .page-heading {
        align-items: flex-start;
    }

    .page-title, .page-subtitle {
        text-align: start;
    }

    .error-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    @media only screen and (max-width: 1024px) {
        section {
            grid-template-columns: 1fr;
            place-items: center;
        }
    }
</style>