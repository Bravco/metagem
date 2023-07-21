export default defineNuxtRouteMiddleware((to) => {
    const { auth } = useFirebase();

    if (!auth.currentUser && to.path === "/generator") {
        return navigateTo("/auth");
    } else if (auth.currentUser && to.path === "/auth") {
        return navigateTo("/");
    }
});