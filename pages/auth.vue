<template>
    <div>
        <section>
            <pre>{{ data }}</pre>
        </section>
    </div>
</template>

<script setup>
    import { doc, onSnapshot } from "firebase/firestore";

    const { firestore } = useFirebase();

    const data = ref(null);

    onMounted(() => {
        const userDoc = doc(firestore, "users", "8oVLFA1sNFRTDGAE65WCKPClByu2");
        onSnapshot(userDoc, snapshot => {
            data.value = snapshot.data();
        });
    });
</script>