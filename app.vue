<template>
    <div>
        <input v-model="message">
        <button @click="sendMessage" v-text="'Send'"/>
        <div>{{ data }}</div>
    </div>
</template>

<script setup>
    const { chat } = useChatgpt()

    const data = ref("")
    const message = ref("")

    async function sendMessage() {
        const response = await chat(message.value)
        data.value = response
    }
</script>