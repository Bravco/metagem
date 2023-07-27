export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            motion: (onVisible: boolean = true, delay: number = 0) => {
                return {
                    initial: {
                        opacity: 0,
                        y: 100,
                    },
                    [onVisible ? "visibleOnce": "enter"]: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 25,
                            mass: .5,
                            delay: 300 + delay,
                        },
                    },
                };
            },
        },
    };
});