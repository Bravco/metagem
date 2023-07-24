export default defineNuxtRouteMiddleware((to) => {
    const { auth } = useFirebase();

    if (!auth.currentUser && (to.path === "/generator" || to.path === "/profile")) {
        return navigateTo("/auth");
    } else if (auth.currentUser && to.path === "/auth") {
        return navigateTo("/");
    }
});