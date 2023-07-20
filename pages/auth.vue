<template>
    <div>
        <section>
            <pre>{{ data }}</pre>
            <button @click="updateUser">Update user</button>
        </section>
    </div>
</template>

<script setup>
    import { doc, onSnapshot, updateDoc } from "firebase/firestore";

    // Server side
    const { data }  = useFetch("/api/user?id=444Dwj6g9aRW3yEJPac6");

    // Client side
    onMounted(() => {
        const { firestore } = useFirebase();
        const docRef = doc(firestore, "users", "444Dwj6g9aRW3yEJPac6");
        onSnapshot(docRef, (snapshot) => {
            data.value = snapshot.data();
        });
    });

    async function updateUser() {
        const { firestore } = useFirebase();
        const docRef = doc(firestore, "users", "444Dwj6g9aRW3yEJPac6");
        await updateDoc(docRef, {
            name: `user-${Math.floor(Math.random() * 1000)}`,
        });
    }
</script>