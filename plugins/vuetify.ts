import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        icons: {
            defaultSet: "mdi",
            aliases,
            sets: {
                mdi,
            },
        },
        components: {
            ...components,
        },
        directives,
    });

    nuxtApp.vueApp.use(vuetify);
});