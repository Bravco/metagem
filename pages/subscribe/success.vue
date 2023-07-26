<template>
    <div>
        <section>
            <div v-if="sessionId">
                <form action="/api/stripe/createPortalSession" method="POST">
                    <input type="hidden" id="session-id" name="session_id" :value="sessionId">
                    <button type="submit" class="btn">
                        Manage your subscription
                    </button>
                </form>
            </div>
            <div v-else>
                <Icon class="loading-icon" name="eos-icons:loading" size="2rem"/>
            </div>
        </section>
    </div>
</template>

<script setup>
    const route = useRoute();
    const sessionId = ref(route.query.sesson_id ? route.query.sesson_id : "");
</script>