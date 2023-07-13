<template>
    <div>
        <div class="heading">
            <h1>Metadata generator</h1>
            <p>Optimize your SEO for business development and company growth. Powered by AI.</p>
        </div>
        <div class="wrapper">
            <div class="container">
                <div class="content-wrapper">
                    <h3>INPUT</h3>
                    <ul class="content-list">
                        <li class="content-item">
                            <div class="content-item-title">
                                <h4>Preview image</h4>
                                <h4>recommended 1200x628</h4>
                            </div>
                            <a class="img-upload">
                                <div class="icon-container">
                                    <Icon name="fa6-solid:arrow-up" size="1.25rem"/>
                                </div>
                                <p>Upload an image</p>
                            </a>
                        </li>
                        <li class="content-item">
                            <h4 class="content-item-title">Website title</h4>
                            <textarea 
                                v-model="websiteTitle" 
                                name="website-title" 
                                id="website-title" 
                                rows="1"
                                placeholder="Athleter"
                            ></textarea>
                        </li>
                        <li class="content-item">
                            <h4 class="content-item-title">Describe your website</h4>
                            <textarea 
                                v-model="websiteDescription" 
                                name="website-description" 
                                id="website-description"
                                rows="5"
                                placeholder="An ecommerce website which specializes on selling sport clothing, shoes and other accessories for athletes."
                            ></textarea>
                        </li>
                        <li class="content-item">
                            <h4 class="content-item-title">Description length</h4>
                            <ul class="choice-list">
                                <li>
                                    <a 
                                        @click.prevent="setDescriptionLength(10)" 
                                        :class="['choice-item', { active: descriptionLength === 10 }]"
                                    >Short</a>
                                </li>
                                <li>
                                    <a 
                                        @click.prevent="setDescriptionLength(15)" 
                                        :class="['choice-item', { active: descriptionLength === 15 }]"
                                    >Medium</a>
                                </li>
                                <li>
                                    <a 
                                        @click.prevent="setDescriptionLength(20)" 
                                        :class="['choice-item', { active: descriptionLength === 20 }]"
                                    >Long</a>
                                </li>
                            </ul>
                        </li>
                        <li class="content-item">
                            <div class="content-item-title">
                                <h4>Keywords count</h4>
                                <ClientOnly>
                                    <v-chip color="var(--color-primary)">{{ keywordsCount }}</v-chip>
                                </ClientOnly>
                            </div>
                            <ClientOnly>
                                <v-slider 
                                    v-model="keywordsCount"
                                    min="0"
                                    max="20"
                                    step="1"
                                    color="var(--color-primary)"
                                    track-color="var(--color-text-alt-light)"
                                ></v-slider>
                            </ClientOnly>
                        </li>
                        <button @click.prevent="generateMetadata" class="cta-btn"><Icon name="fa6-solid:bolt"/>Generate</button>
                    </ul>
                </div>
            </div>
            <div class="container">
                <div class="content-wrapper">
                    <h3>METADATA</h3>
                    <ul class="content-list">
                        <li v-for="response in responses" :key="response" class="content-item">
                            <h4 class="content-item-title">Today • 11:19AM</h4>
                            <div class="response-container">
                                <div>
                                    <p class="response-author">{{ response.author }}</p>
                                    <h3>{{ response.title }}</h3>
                                </div>
                                <p>{{ response.description }}</p>
                                <ul class="keyword-list">
                                    <li v-for="(keyword, index) in response.keywords" :key="index" class="keyword-item">
                                        <input
                                            v-model="response.keywords[index]" type="text" 
                                            :style="{width: (response.keywords[index].length*10 + 1) + 'px'}"
                                            maxlength="20"
                                        >
                                        <button @click.prevent="removeKeyword(keyword)">
                                            <Icon name="fa6-solid:xmark" size="1rem"/>
                                        </button>
                                    </li>
                                    <button @click.prevent="addKeyword" class="keyword-add">
                                        <Icon name="fa6-solid:plus" size="1rem"/>
                                    </button>
                                </ul>
                                <div class="response-footer">
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
                                        <button class="code-btn">
                                            <Icon name="fa6-solid:code" size="1rem"/>
                                        </button>
                                        <button @click.prevent="deleteResponse(response)" class="delete-btn">
                                            <Icon name="fa6-solid:trash-can" size="1rem"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const { chat } = useChatgpt()

    const websiteTitle = ref("");
    const websiteDescription = ref("");
    const descriptionLength = ref(15);
    const keywordsCount = ref(10);
    const responses = ref([]);
    const currentResponseIndex = ref(0);

    function setDescriptionLength(length) {
        descriptionLength.value = length;
    }

    function addKeyword() {
        if (responses.value[currentResponseIndex.value].keywords) {
            responses.value[currentResponseIndex.value].keywords.push("New Keyword");
        } else {
            responses.value[currentResponseIndex.value].keywords = ["New Keyword"];
        }
    }

    function removeKeyword(keyword) {
        responses.value[currentResponseIndex.value].keywords.pop(keyword);
    }

    function setResponseFeedback(value) {
        if (responses.value[currentResponseIndex.value].feedback && 
            (responses.value[currentResponseIndex.value].feedback === value)) {
            delete responses.value[currentResponseIndex.value].feedback;
        } else {
            responses.value[currentResponseIndex.value].feedback = value;
        }
    }

    function deleteResponse(response) {
        responses.value.pop(response);
    }

    async function generateMetadata() {
        let newResponse = {};

        newResponse.author = websiteTitle.value;

        const titleMsg = `Generate short metadata title for website: ${websiteDescription.value}`;
        const generatedTitle = await chat(titleMsg)
        generatedTitle.replaceAll('"', "");
        newResponse.title = websiteTitle.value.concat(" - ", generatedTitle);

        const descriptionMsg = `Generate metadata description with length of ${descriptionLength.value} words for website: ${websiteDescription.value}`;
        const generatedDescription = await chat(descriptionMsg);
        generatedDescription.replaceAll('"', "");
        newResponse.description = generatedDescription;

        if (keywordsCount.value > 0) {
            const keywordMsg = `Generate ${keywordsCount.value} metadata keywords in a single line without list style for website: ${websiteDescription.value}`;
            const rawKeywords = await chat(keywordMsg);
            const generatedKeywords = rawKeywords.split(", ");
            newResponse.keywords = generatedKeywords;
        }

        responses.value.push(newResponse);
    }
</script>

<style scoped>
    .heading {
        text-align: center;
        margin-bottom: 1rem;
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

    .container:first-of-type {
        height: min-content;
    }

    .divider {
        height: 100%;
        display: grid;
        grid-template-rows: 1fr calc(1rem + 2rem) 1fr;
        padding: 2rem 0;
    }
    
    .divider-line {
        width: min-content;
        margin: 0 auto;
        border: 1px solid var(--color-text-alt-light);
    }

    .divider-icon {
        align-self: center;
        color: var(--color-text-alt-dark);
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

    .content-item {
        width: 100%;
        display: grid;
        gap: .5rem;
    }

    .content-item-title {
        display: flex;
        justify-content: space-between;
        color: var(--color-text-alt-dark);
    }

    .img-upload {
        display: grid;
        place-items: center;
        gap: 0.5rem;
        padding: 4rem;
        border-radius: 0.5rem;
        font-weight: bold;
        color: #00418E;
        background: linear-gradient(180deg, rgba(0, 255, 194, 0.00) 0%, rgba(0, 255, 194, 0.50) 0.01%, rgba(55, 253, 205, 0.50) 48.44%, rgba(55, 146, 253, 0.50) 100%);
    }

    .img-upload .icon-container {
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: .5rem;
    }

    .choice-item {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        padding: .5rem 2rem;
        border-radius: .5rem;
        background-color: var(--color-background-primary);
    }

    .choice-item.active {
        color: white;
        background-color: var(--color-primary); 
    }

    .response-container {
        display: grid;
        gap: .5rem;
        padding: 1.5rem 2rem;
        border-radius: .5rem;
        background-color: var(--color-background-primary);
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
        color: #FF2681;
    }
</style>