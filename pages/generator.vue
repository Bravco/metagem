<template>
    <div>
        <div class="page-heading">
            <h1 v-motion="$motion(false)" class="page-title"><span>Metadata</span> generator</h1>
            <p v-motion="$motion(false, 300)" class="page-subtitle">
                Optimize your <span>SEO</span> for business development and company growth. Powered by <span>AI</span>.
            </p>
        </div>
        <div v-motion="$motion(false, 600)" class="wrapper">
            <div class="container">
                <div class="content-wrapper">
                    <h3>INPUT</h3>
                    <ul class="content-list no-overflow">
                        <li class="content-item">
                            <div class="content-item-title">
                                <h4>Preview image</h4>
                                <h4>recommended 1200x630</h4>
                            </div>
                            <div class="input-preview-img-container">
                                <nuxt-img v-if="previewImg" :src="previewImg" alt="preview-image"/>
                                <a v-else @click.prevent="focusPreviewImgInput" class="input-preview-img-placeholder">
                                    <div class="icon-container">
                                        <Icon name="fa6-solid:arrow-up" size="1.25rem"/>
                                    </div>
                                    <p>Upload an image</p>
                                </a>
                            </div>
                            <v-file-input
                                class="preview-img-input"
                                v-model="rawPreviewImg"
                                @update:model-value="updatePreviewImg"
                                @click:clear="previewImg = null"
                                accept="image/*"
                                label="Upload an image"
                                prepend-icon=""
                                prepend-inner-icon="mdi-image"
                                bg-color="var(--color-background-primary)"
                                base-color="transparent"
                            />
                        </li>
                        <li class="content-item">
                            <h4 class="content-item-title">Website title</h4>
                            <textarea 
                                v-model="websiteTitle" 
                                name="website-title" 
                                id="website-title" 
                                rows="1"
                                maxlength="32"
                                placeholder="Athleter"
                            ></textarea>
                        </li>
                        <li class="content-item">
                            <h4 class="content-item-title">Describe your website</h4>
                            <textarea 
                                v-model="websiteDescription" 
                                name="website-description" 
                                id="website-description"
                                rows="4"
                                maxlength="128"
                                placeholder="An ecommerce website which specializes on selling sport clothing, shoes and other accessories for athletes."
                            ></textarea>
                        </li>
                        <li class="content-item">
                            <h4 class="content-item-title">Description length</h4>
                            <ul class="choice-list">
                                <li v-for="(descriptionLength, index) in descriptionLengths" :key="index">
                                    <button 
                                        @click.prevent="selectDescriptionLength(index)" 
                                        :class="[
                                            'choice-item',
                                            { active: selectedDescriptionLengthIndex === index },
                                            { inactive: paid === false && selectedDescriptionLengthIndex !== index }
                                        ]"
                                        :aria-label="descriptionLength.title + 'description'"
                                    >{{ descriptionLength.title }}</button>
                                </li>
                            </ul>
                        </li>
                        <li class="content-item">
                            <div class="content-item-title">
                                <h4>Keywords count</h4>
                                <v-chip color="var(--color-primary)">{{ keywordsCount }}</v-chip>
                            </div>
                            <v-slider 
                                v-model="keywordsCount"
                                min="0"
                                :max="keywordsMax"
                                step="1"
                                color="var(--color-primary)"
                                track-color="var(--color-text-alt-light)"
                            ></v-slider>
                        </li>
                        <div class="generate-btn-wrapper">
                            <v-tooltip width="auto">
                                <p>Free trial has lifetime max 10 generations.</p>
                                <p>Professional plan gives 500 generations per month.</p>
                                <template v-slot:activator="{ props }">
                                    <span v-bind="props">
                                        Generations:
                                        {{ generationsCount ? generationsCount : 0 }}
                                        /
                                        {{ paid ? 500 : 10 }}
                                    </span>
                                </template>
                            </v-tooltip>
                            <button @click.prevent="generateMetadata" class="btn"><Icon name="fa6-solid:bolt"/>Generate</button>
                        </div>
                    </ul>
                    <div v-if="errorMsg" class="error-msg">
                        <Icon name="fa6-solid:triangle-exclamation"/>
                        You have reached maximum generations count.
                    </div>
                    <div v-if="paid === false" class="error-msg">
                        <Icon name="fa6-solid:triangle-exclamation"/>
                        This is free trial version with restrictions.
                        <button @click.prevent="navigateTo('/pricing')" class="upgrade-btn" aria-label="Upgrade now">Upgrade now for full access!</button>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="content-wrapper">
                    <h3>METADATA</h3>
                    <ul class="content-list">
                        <li 
                            v-for="(response, index) in responses" 
                            :key="index"
                            :class="['content-item', { active: selectedResponseIndex === index }]"
                        >
                            <h4 class="content-item-title">
                                {{ response.createdDate.getDate() }}/{{ response.createdDate.getMonth()+1 }}/{{ response.createdDate.getFullYear() }}
                                •
                                {{ response.createdDate.getHours() }}:{{ response.createdDate.getMinutes() < 10 ? '0' : null }}{{ response.createdDate.getMinutes() }}
                            </h4>
                            <div @click.prevent="selectedResponseIndex = index" class="response-container">
                                <div>
                                    <p 
                                        class="response-author"
                                        :contenteditable="paid"
                                        @input="(e) => {
                                            response.author = e.target.innerText;
                                            updateFirestoreField(response, 'author');
                                        }"
                                    >{{ response.author }}</p>
                                    <h3 
                                        :contenteditable="paid" 
                                        @input="(e) => { 
                                            response.title = e.target.innerText;
                                            updateFirestoreField(response, 'title');
                                        }"
                                    >{{ response.title }}</h3>
                                </div>
                                <p
                                    :contenteditable="paid"
                                    @input="(e) => {
                                        response.description = e.target.innerText;
                                        updateFirestoreField(response, 'description');
                                    }"
                                >{{ response.description }}</p>
                                <ul v-if="selectedResponseIndex === index" class="keyword-list">
                                    <li v-for="(keyword, index) in response.keywords" :key="index" class="keyword-item">
                                        <p
                                            :contenteditable="paid"
                                            @input="(e) => {
                                                response.keywords[index] = e.target.innerText;
                                                updateFirestoreField(response, 'keywords');
                                            }"
                                        >{{ response.keywords[index] }}</p>
                                        <button @click.prevent="removeKeyword(keyword)">
                                            <Icon name="fa6-solid:xmark" size="1rem"/>
                                        </button>
                                    </li>
                                    <button @click.prevent="addKeyword" class="keyword-add">
                                        <Icon name="fa6-solid:plus" size="1rem"/>
                                    </button>
                                </ul>
                                <div v-if="selectedResponseIndex === index" class="response-footer">
                                    <div class="feedback">
                                        <button 
                                            @click.prevent="setResponseFeedback(1)" 
                                            :class="['feedback-btn', { active: response.feedback === 1 }]"
                                        >
                                            <Icon name="fa6-solid:thumbs-up" size="1rem"/>
                                        </button>
                                        <button 
                                            @click.prevent="setResponseFeedback(0)" 
                                            :class="['feedback-btn', { active: response.feedback === 0 }]"
                                        >
                                            <Icon name="fa6-solid:thumbs-down" size="1rem"/>
                                        </button>
                                    </div>
                                    <div class="actions">
                                        <v-dialog v-model="codeDialog" width="auto">
                                            <template v-slot:activator="{ props }">
                                                <button v-bind="props" class="code-btn">
                                                    <Icon name="fa6-solid:code" size="1rem"/>
                                                </button>
                                            </template>
                                            <div class="dialog-container">
                                                <button @click.prevent="codeDialog = false" class="dialog-close-btn">
                                                    <Icon name="fa6-solid:xmark"/>
                                                </button>
                                                <Logo/>
                                                <p class="dialog-subtitle">Generated with AI</p>
<pre><code id="meta-code">&lt;title&gt;{{ response.title }}&lt;/title&gt;
&lt;meta charset="utf-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
&lt;meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"&gt;

&lt;meta name="author" content="{{ response.author }}"&gt;
&lt;meta name="title" content="{{ response.title }}"&gt;
&lt;meta name="description" content="{{ response.description }}"&gt;
{{ response.keywords ? `&lt;meta name="keywords" content="${response.keywords.join(", ")}"&gt;\n` : "" }}
&lt;meta property="og:type" content="website"&gt;
&lt;meta property="og:site_name" content="{{ response.author }}"&gt;
&lt;meta property="og:url" content="<span class="meta-code-highlight">PASTE YOUR WEBSITE URL HERE</span>"&gt;
&lt;meta property="og:title" content="{{ response.title }}"&gt;
&lt;meta property="og:description" content="{{ response.description }}"&gt;
&lt;meta property="og:image" content="<span class="meta-code-highlight">PASTE YOUR IMAGE PATH HERE</span>"&gt;

&lt;meta property="twitter:card" content="summary_large_image"&gt;
&lt;meta property="twitter:title" content="{{ response.title }}"&gt;
&lt;meta property="twitter:description" content="{{ response.description }}"&gt;
&lt;meta property="twitter:image" content="<span class="meta-code-highlight">PASTE YOUR IMAGE PATH HERE</span>"&gt;</code></pre>
                                                <div class="dialog-footer">
                                                    <p>Copy into your website's <span>&lt;head&gt;</span> tag.</p>
                                                    <v-btn 
                                                        @click="copyMeta"
                                                        :prepend-icon="isCopied ? 'mdi-check' : 'mdi-content-copy'" 
                                                        variant="tonal" 
                                                        color="var(--color-primary)"
                                                        :text="isCopied ? 'Copied' : 'Copy'"
                                                    />
                                                </div>
                                            </div>
                                        </v-dialog>
                                        <button @click.prevent="deleteResponse(response)" class="delete-btn">
                                            <Icon name="fa6-solid:trash-can" size="1rem"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li v-if="loading">
                            <Icon class="loading-icon" name="eos-icons:loading" size="2rem"/>
                        </li>
                    </ul>
                </div>
                <div class="divider">
                    <div class="divider-line"/>
                    <Icon class="divider-icon" name="fa6-solid:angle-right" size="1.5rem"/>
                    <div class="divider-line"/>
                </div>
                <div class="content-wrapper">
                    <h3>PREVIEW</h3>
                    <ul v-if="responses.length !== 0" class="content-list">
                        <li class="content-item">
                            <h4 class="content-item-title">Google</h4>
                            <div class="google-container">
                                <div class="google-heading">
                                    <div class="google-preview-icon">
                                        <nuxt-img v-if="previewImg" :src="previewImg" alt="preview-icon"/>
                                    </div>
                                    <div>
                                        <p class="preview-text">example.com</p>
                                        <p class="preview-url preview-text">https://example.com</p>
                                    </div>
                                </div>
                                <div>
                                    <p v-if="responses[selectedResponseIndex].title" class="google-title preview-text">
                                        {{ responses[selectedResponseIndex].title }}
                                    </p>
                                    <p v-if="responses[selectedResponseIndex].description" class="preview-description preview-text">
                                        {{ responses[selectedResponseIndex].description }}
                                    </p>
                                </div>
                            </div>
                        </li>
                        <li class="content-item">
                            <h4 class="content-item-title">Twitter</h4>
                            <div>
                                <div class="preview-img-container">
                                    <nuxt-img v-if="previewImg" :src="previewImg" alt="preview-image"/>
                                </div>
                                <div class="preview-footer">
                                    <p class="preview-title preview-text">{{ responses[selectedResponseIndex].title }}</p>
                                    <p class="preview-description preview-text">{{ responses[selectedResponseIndex].description }}</p>
                                    <p class="preview-url preview-text">example.io</p>
                                </div>
                            </div>
                        </li>
                        <li class="content-item">
                            <h4 class="content-item-title">Open Graph</h4>
                            <div>
                                <div class="preview-img-container">
                                    <nuxt-img v-if="previewImg" :src="previewImg" alt="preview-image"/>
                                </div>
                                <div class="preview-footer">
                                    <p class="preview-url preview-text">example.io</p>
                                    <p class="preview-title preview-text">{{ responses[selectedResponseIndex].title }}</p>
                                    <p class="preview-description preview-text">{{ responses[selectedResponseIndex].description }}</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { collection, doc, onSnapshot, addDoc, updateDoc, getDocs, deleteDoc, deleteField, getDoc } from "firebase/firestore";

    useHead({
        title: "Metagem | Metadata Generator",
    });

    definePageMeta({
        middleware: ["auth"],
    });

    const { $motion } = useNuxtApp();

    const { chat } = useChatgpt();
    const { auth, firestore } = useFirebase();

    const descriptionLengths = [
        { title: "Short", length: 10 },
        { title: "Medium", length: 20 },
        { title: "Long", length: 30 },
    ];

    const subscription = ref(null);
    const generationsCount = ref(null);
    const loading = ref(false);
    const websiteTitle = ref("");
    const websiteDescription = ref("");
    const selectedDescriptionLengthIndex = ref(0);
    const keywordsCount = ref(0);
    const rawPreviewImg = ref(null);
    const previewImg = ref(null);
    const responses = ref([]);
    const selectedResponseIndex = ref(0);
    const codeDialog = ref(false);
    const isCopied = ref(false);
    const errorMsg = ref(null);

    const paid = computed(() => {
        if (subscription.value === null) {
            return false;
        } else {
            return (new Date) < subscription.value;
        }
    });

    const keywordsMax = computed(() => {
        if (paid.value === true) {
            return 50;
        } else {
            return 5;
        }
    });

    function updatePreviewImg() {
        if (rawPreviewImg.value && rawPreviewImg.value.length !== 0) {
            const reader = new FileReader();

            reader.onload = function(event) {
                const dataURL = event.target.result;
                previewImg.value = dataURL;
            }

            reader.readAsDataURL(rawPreviewImg.value[0]);
        }
    }

    function focusPreviewImgInput() {
        document.querySelector(".preview-img-input").focus();
    }

    function selectDescriptionLength(index) {
        if (paid.value === true) {
            selectedDescriptionLengthIndex.value = index;
        }
    }

    function updateFirestoreField(response, key) {
        if (response.id) {
            const responseRef = doc(firestore, "users", auth.currentUser.uid, "responses", response.id);
            updateDoc(responseRef, {
                [key]: response[key],
            });
        }
    }

    function addKeyword() {
        const selectedResponse = responses.value[selectedResponseIndex.value];

        if (selectedResponse.keywords) {
            selectedResponse.keywords.push("New Keyword");
        } else {
            selectedResponse.keywords = ["New Keyword"];
        }

        updateFirestoreField(selectedResponse, "keywords");
    }

    function removeKeyword(keyword) {
        const selectedResponse = responses.value[selectedResponseIndex.value];

        selectedResponse.keywords.pop(keyword);
        if (selectedResponse.keywords.length === 0) {
            delete selectedResponse.keywords;
        }

        if (selectedResponse.id) {
            const responseRef = doc(firestore, "users", auth.currentUser.uid, "responses", selectedResponse.id);
            const keywordsUpdate = { keywords: selectedResponse.keywords ? selectedResponse.keywords : deleteField() };
            updateDoc(responseRef, keywordsUpdate);
        }
    }

    function setResponseFeedback(value) {
        const selectedResponse = responses.value[selectedResponseIndex.value];

        if (selectedResponse.feedback === value) {
            delete selectedResponse.feedback;
        } else {
            selectedResponse.feedback = value;
        }

        if (selectedResponse.id) {
            const responseRef = doc(firestore, "users", auth.currentUser.uid, "responses", selectedResponse.id);
            const feedbackUpdate = { feedback: selectedResponse.feedback === value ? value : deleteField() };
            updateDoc(responseRef, feedbackUpdate);
        }
    }

    function deleteResponse(response) {
        selectedResponseIndex.value = 0;
        responses.value = responses.value.filter(e => e !== response);

        if (response.id) {
            const responseRef = doc(firestore, "users", auth.currentUser.uid, "responses", response.id);
            deleteDoc(responseRef);
        }
    }

    function copyMeta() {
        const metaCode = document.getElementById("meta-code");
        navigator.clipboard.writeText(metaCode.innerText);
        isCopied.value = true;
        setTimeout(() => {
            isCopied.value = false;
        }, 1000);
    }

    async function generateMetadata() {
        const userRef = doc(firestore, "users", auth.currentUser.uid);

        if ((paid.value === false && generationsCount.value >= 10) || (paid.value === true && generationsCount.value >= 500)) {
            errorMsg.value = true;
            return;
        }

        if (websiteTitle.value === "" || websiteDescription.value === "") return;

        loading.value = true;

        let newResponse = {};

        newResponse.createdDate = new Date;
        newResponse.author = websiteTitle.value;

        const titleMsg = `Generate short meta-title for website: ${websiteDescription.value}`;
        let generatedTitle = await chat(titleMsg)
        generatedTitle = generatedTitle.replaceAll('"', "");
        newResponse.title = websiteTitle.value.concat(" - ", generatedTitle);

        const descriptionMsg = `Generate meta-description with length of ${descriptionLengths[selectedDescriptionLengthIndex.value].length} words for website: ${websiteDescription.value}`;
        let generatedDescription = await chat(descriptionMsg);
        generatedDescription = generatedDescription.replaceAll('"', "");
        newResponse.description = generatedDescription;

        if (keywordsCount.value > 0) {
            const keywordMsg = `Generate ${keywordsCount.value} meta seo keywords in a single line without list style for website: ${websiteDescription.value}`;
            let generatedKeywords = await chat(keywordMsg);
            if (generatedKeywords.endsWith(".")) {
                generatedKeywords = generatedKeywords.replace(/\.$/, "");
            }
            generatedKeywords = generatedKeywords.split(", ");
            newResponse.keywords = generatedKeywords;
        }

        loading.value = false;

        if (paid) {
            const responsesCollection = collection(firestore, "users", auth.currentUser.uid, "responses");
            const responseRef = await addDoc(responsesCollection, newResponse);
            updateDoc(responseRef, {
                id: responseRef.id,
            });
            newResponse.id = responseRef.id;
        }

        responses.value.push(newResponse);

        updateDoc(userRef, {
            generationsCount: generationsCount.value ? generationsCount.value+1 : 1,
        });
    }

    onMounted(async () => {
        const userRef = doc(firestore, "users", auth.currentUser.uid);
        onSnapshot(userRef, (snapshot) => {
            const data = snapshot.data();

            if (data.subscription) {
                subscription.value = data.subscription.toDate();
            }

            if (data.generationsCount) {
                generationsCount.value = data.generationsCount;
            }
        });

        const responsesCollection = collection(firestore, "users", auth.currentUser.uid, "responses");
        getDocs(responsesCollection).then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                let response = doc.data();
                response.createdDate = response.createdDate.toDate();
                responses.value.push(response);
            });
        });
    });
</script>

<style scoped>
    .inactive {
        opacity: 50%;
        pointer-events: none;
    }

    .wrapper {
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 2rem;
        padding: 1rem 5%;
    }

    .container {
        display: flex;
        justify-content: space-between;
        border-radius: .5rem;
        background-color: var(--color-background-secondary);
    }

    .container:last-of-type {
        display: grid;
        grid-template-columns: 1fr 2rem 1fr;
    }

    .divider {
        height: 100%;
        display: grid;
        grid-template-rows: 1fr 2.5rem 1fr;
        padding: 2rem 0;
    }
    
    .divider-line {
        width: min-content;
        margin: 0 auto;
        border: 1px solid var(--color-background-primary);
    }

    .divider-icon {
        align-self: center;
        color: var(--color-background-primary);
    }

    .content-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem 2rem;
    }

    .content-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .content-list:not(.no-overflow) {
        max-height: 100vh;
        overflow-y: auto;
    }

    .content-item {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .content-item-title {
        display: flex;
        justify-content: space-between;
        color: var(--color-text-alt-dark);
    }

    .generate-btn-wrapper {
        display: grid;
        place-items: center;
    }

    .generate-btn-wrapper span {
        font-weight: bold;
        color: var(--color-text-alt-light);
        cursor: pointer;
    }

    .input-preview-img-container, .input-preview-img-container img, .input-preview-img-placeholder {
        width: 100%;
        height: 12rem;
        border-radius: .5rem;
    }

    .input-preview-img-container img {
        object-fit: cover;
        object-position: center;
    }

    .input-preview-img-placeholder {
        display: grid;
        place-items: center;
        gap: 0.5rem;
        padding: 4rem;
        border-radius: 0.5rem;
        font-weight: bold;
        color: #00418E;
        background: linear-gradient(180deg, rgba(0, 255, 194, 0.00) 0%, rgba(0, 255, 194, 0.50) 0.01%, rgba(55, 253, 205, 0.50) 48.44%, rgba(55, 146, 253, 0.50) 100%);
    }

    .preview-img-placeholder .icon-container {
        width: 3rem;
        height: 3rem;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background-color: white;
    }

    textarea {
        width: 100%;
        border-radius: .5rem;
    }

    textarea:focus {
        border-color: var(--color-primary);
    }

    .content-item:has(textarea:focus) .content-item-title {
        color: var(--color-primary);
    }

    .choice-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
        gap: .5rem;
    }

    .choice-item {
        width: 100%;
        display: grid;
        place-items: center;
        padding: .5rem 0;
        border-radius: .5rem;
        background-color: var(--color-background-primary);
    }

    .choice-item.active {
        color: white;
        background-color: var(--color-primary); 
    }

    .content-item.active .response-container {
        border: 2px solid var(--color-primary);
    }

    .response-container {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding: 1.5rem 2rem;
        border-radius: .5rem;
        background-color: var(--color-background-primary);
        cursor: pointer;
    }

    .response-author {
        font-size: .75rem;
        font-weight: bold;
        color: var(--color-text-alt-light);
    }

    .keyword-list {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
    }

    .keyword-item, .keyword-add {
        border-radius: .5em;
        background-color: var(--color-background-secondary);
    }

    .keyword-item {
        width: fit-content;
        display: flex;
        align-items: center;
        gap: .5rem;
        padding: .5rem 1rem;
    }

    .keyword-add {
        width: 2.5rem;
        height: 2.5rem;
        display: grid;
        place-items: center;
    }

    .response-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .feedback, .actions {
        display: flex;
        gap: .5rem;
    }

    .feedback-btn {
        color: var(--color-text-alt-light);
    }

    .feedback-btn.active {
        color: var(--color-primary);
    }

    .code-btn, .delete-btn {
        width: 2rem;
        height: 2rem;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background-color: var(--color-background-secondary);
    }

    .code-btn {
        color: var(--color-primary);
    }

    .delete-btn {
        color: var(--color-red);
    }

    .dialog-container {
        display: flex;
        flex-direction: column;
        padding: 2rem;
        border-radius: .5rem;
        background-color: var(--color-background-primary);
    }

    .dialog-close-btn {
        align-self: flex-end;
        color: var(--color-text-alt-light);
    }

    .dialog-subtitle {
        margin-bottom: 1rem;
        text-align: center;
        font-size: .75rem;
        font-weight: bold;
        color: var(--color-text-alt-light);
    }

    .dialog-container pre {
        max-height: 50vh;
        padding: 1rem;
        overflow: auto;
        border-radius: .5rem .5rem 0 0;
        background-color: var(--color-background-secondary);
    }

    .meta-code-highlight {
        font-family: unset;
        color: var(--color-var(--color-background-secondary));
    }

    .dialog-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-radius: 0 0 .5rem .5rem;
        background-color: var(--color-background-secondary-dark);
    }

    .dialog-footer span {
        padding: .125rem .25rem;
        border: 1px solid var(--color-text-alt-dark);
        border-radius: .5rem;
    }

    .preview-text {
        font-family: arial, sans-serif;
    }

    .preview-title {
        font-weight: bold;
    }

    .preview-description {
        font-size: .875rem;
    }

    .preview-url {
        font-size: .75rem;
        color: var(--color-text-alt-dark);
    }

    .preview-img-container {
        background-color: var(--color-background-secondary-dark);
    }

    .preview-img-container, .preview-img-container img {
        width: 100%;
        height: 16rem;
        border-radius: .5rem .5rem 0 0;
    }

    .preview-img-container img {
        object-fit: cover;
        object-position: center;
    }

    .preview-footer {
        padding: .75rem 1rem;
        border-radius: 0 0 .5rem .5rem;
        background-color: var(--color-background-primary);
    }

    .google-container {
        padding: .75rem 1rem;
        border-radius: .5rem;
        background-color: var(--color-background-primary);
    }

    .google-heading {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .google-preview-icon {
        background-color: var(--color-background-secondary-dark);
    }

    .google-preview-icon, .google-preview-icon img {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
    }

    .google-preview-icon img {
        object-fit: cover;
        object-position: center;
    }

    .google-title {
        font-size: 1.125rem;
        color: #1a0dab;
        cursor: pointer;
    }

    .google-title:hover {
        text-decoration: underline;
    }

    .error-msg {
        text-align: center;
        color: var(--color-red);
    }

    .upgrade-btn {
        color: var(--color-primary);
        text-decoration: underline;
    }

    @media only screen and (max-width: 768px) {
        .content-wrapper {
            padding: .5rem;
        }

        .choice-item {
            padding: .25rem 0;
        }
    }

    @media only screen and (max-width: 1024px) {
        .container:last-of-type {
            grid-template-columns: 1fr;
        }

        .divider {
            width: 100%;
            display: grid;
            grid-template-rows: unset;
            grid-template-columns: 1fr 2.5rem 1fr;
            padding: 0 2rem;
        }
        
        .divider-line {
            width: 100%;
            height: min-content;
            margin: auto 0;
            border: 1px solid var(--color-background-primary);
        }

        .divider-icon {
            rotate: 90deg;
            align-self: center;
            justify-self: center;
            color: var(--color-background-primary);
        }
    }

    @media only screen and (max-width: 1280px) {
        .wrapper {
            grid-template-columns: 1fr;
        }
    }
</style>