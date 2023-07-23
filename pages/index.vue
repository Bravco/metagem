<template>
    <div>
        <section ref="perspectiveWrapper" id="hero">
			<div class="page-heading">
				<h1 class="page-title">
					<span>Maximize</span> your <span>online reach</span>
					with precisely generated metadata
				</h1>
				<p class="page-subtitle">
					Unleash the power of <span>AI</span> for superior website reach and rankings.
					Massively enhance your <span>SEO</span> for greater success.
				</p>
				<div class="btns">
					<button @click.prevent="navigateTo('#about')" class="outlined-btn" aria-label="Learn more">
						Learn more<Icon name="fa6-solid:arrow-turn-down"/>
					</button>
					<button @click.prevent="navigateTo('generator')" class="cta-btn" aria-label="Try for free">
						<Icon name="fa6-solid:bolt"/>Try for free
					</button>
				</div>
			</div>
            <nuxt-img class="preview-img" src="images/preview.webp" alt="preview-image"/>
        </section>
		<section id="benefits">
			<span class="big-bg-text">Better search rankings</span>
			<ul class="benefit-list">
				<li class="benefit-item">
					<div class="benefit-heading">
						<span class="icon-container">
							<Icon name="fa6-solid:magnifying-glass-dollar" size="1.5rem"/>
						</span>
						<h3>Improve SEO</h3>
					</div>
					<p>The improved SEO metadata generator offers advanced AI-driven keyword research, schema markup for rich snippets, and mobile-friendly optimization, boosting search engine visibility and organic traffic.</p>
				</li>
				<li class="benefit-item">
					<div class="benefit-heading">
						<span class="icon-container">
							<Icon name="fa6-solid:pen-ruler" size="1.5rem"/>
						</span>
						<h3>Fully customizable</h3>
					</div>
					<p>The fully customizable metadata generator allows users to tailor metadata fields, formats, and options, providing maximum flexibility and accuracy for data organization and retrieval.</p>
				</li>
				<li class="benefit-item">
					<div class="benefit-heading">
						<span class="icon-container">
							<Icon name="fa6-solid:robot" size="1.5rem"/>
						</span>
						<h3>Powered by AI</h3>
					</div>
					<p>The Powered by AI metadata generator efficiently analyzes content to produce accurate and relevant metadata, streamlining data organization and enhancing discoverability.</p>
				</li>
			</ul>
		</section>
		<section id="about">
			<div class="about-content">
				<div>
					<h2>About <span>metagen</span></h2>
					<div class="about-text">
						<p>Your AI-powered metadata ally. Elevate SEO with personalized meta tags, captivating titles, and compelling descriptions for digital success.</p>
						<ul>
							<li class="about-text-list-item">Boost SEO</li>
							<li class="about-text-list-item">Use AI as an advantage</li>
							<li class="about-text-list-item">Grow your online reach</li>
						</ul>
						<p>Your AI-powered metadata ally for website success!</p>
					</div>
				</div>
				<ul class="about-benefit-list">
					<li class="about-benefit-item">
						<span class="big-icon-container">
							<Icon name="fa6-solid:wand-magic-sparkles" size="2rem"/>
						</span>
						<h3>AI-Powered Metadata Generation</h3>
						<p>We use advanced AI algorithms to analyze website content and generate tailor-made metadata, including meta tags, titles, and descriptions.</p>
						<button @click.prevent="navigateTo('generator')" class="cta-btn" aria-label="Try for free">
							Get started - it's free<Icon name="fa6-solid:arrow-right-long"/>
						</button>
					</li>
					<li class="about-benefit-item">
						<span class="big-icon-container">
							<Icon name="fa6-solid:traffic-light" size="2rem"/>
						</span>
						<h3>Enhance SEO and User Engagement</h3>
						<p>By optimizing metadata, metagen improves search engine rankings, driving more organic traffic and enhancing the user's browsing experience.</p>
					</li>
				</ul>
			</div>
			<nuxt-img class="about-img" loading="lazy" src="images/about.webp" alt="about-img"/>
		</section>
		<section id="faq">
			<h2>Frequently asked <span>questions</span></h2>
			<ul class="faq-list">
				<li v-for="faq in faqs" @click="selectFaqItem(faq.id)" class="faq-item">
					<div class="faq-top">
						<div class="faq-leading">
							<span class="small-icon-container">
								<Icon name="fa6-solid:question"/>
							</span>
							<p class="faq-question">{{ faq.question }}</p>
						</div>
						<div class="faq-trailing">
							<Icon :name="faq.id === selectedFaqId ? 'fa6-solid:angle-up' : 'fa6-solid:angle-down'"/>
						</div>
					</div>
					<p v-if="selectedFaqId === faq.id" class="faq-answer">{{ faq.answer }}</p>
				</li>
			</ul>
		</section>
    </div>
</template>

<script setup>
	useHead({
        title: "metagen | Home",
    });

	const faqs = [
		{
			id: 0,
			question: "Is metagen free?",
			answer: "Metagen is paid software product, but you can use the free version of the app with some restrictions.",
		},
		{
			id: 1,
			question: "What metagen can give to me?",
			answer: "Metagen's main purpose is to generate metadata and provide them to the user for his own use.",
		},
		{
			id: 2,
			question: "Who is the targeted audience of metagen?",
			answer: "Our targeted audience are mainly website developers, SEO engineers, online businesses or web start-ups.",
		},
		{
			id: 3,
			question: "Can I use it commercially?",
			answer: "Yes you can. Any kind of license is not necessary. It's all AI generated and every generation is unique.",
		},
	];
	const selectedFaqId = ref(null);
	const perspectiveWrapper = ref(null);

	function selectFaqItem(id) {
		if (selectedFaqId.value === id) {
			selectedFaqId.value = null;
		} else {
			selectedFaqId.value = id;
		}
	}

	function handleScroll() {
		if (process.client) {
			requestAnimationFrame(() => {
				const relativeScrollPosition = Math.min(window.scrollY, perspectiveWrapper.value.scrollHeight);
				const value = relativeScrollPosition / perspectiveWrapper.value.scrollHeight;
				document.body.style.setProperty("--relative-scroll", value);
			});
		}
	}

	onMounted(() => {
		if (process.client) {
			window.addEventListener("scroll", handleScroll);
		}
	});

	onUnmounted(() => {
		if (process.client) {
			window.removeEventListener("scroll", handleScroll);
		}
	});
</script>

<style scoped>
	#hero {
		gap: 4rem;
		perspective: 100vw;
	}

	.page-heading {
		gap: 2rem;
	}

	.page-heading::after {
		content: "";
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
		background: radial-gradient(ellipse at center, rgba(43, 228, 207, .25) 0%, transparent 50%);
	}

	.page-title {
		width: 70%;
	}

	.page-subtitle {
		width: 50%;
	}

	.btns {
		display: flex;
		gap: 2rem;
	}

	.preview-img {
		width: 100%;
		height: 100%;
		border-radius: .5rem;
		box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, .1);
		animation: scrollTilt 1s linear infinite;
	  	animation-play-state: paused;
	  	animation-delay: calc(var(--relative-scroll) * -1s);
	}

	.big-bg-text {
		font-weight: bold;
		font-size: 7rem;
		color: rgba(43, 228, 207, .25);
	}

	.benefit-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		align-items: start;
		gap: 2rem;
		padding: 4rem 0 8rem 0;
	}

	.benefit-item {
		display: grid;
		gap: 1rem;
		position: relative;
	}

	.benefit-item:not(:last-child)::after {
		content: "";
		width: 2px;
		height: calc(100% + 2rem);
		position: absolute;
		right: -1rem;
		top: -1rem;
		background-color: var(--color-background-secondary);
	}

	.benefit-heading {
		display: flex;
		align-items: center;
		gap: .5rem;
	}

	#about {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		place-items: center;
		gap: 4rem;
		background-color: var(--color-background-secondary);
	}

	.about-content {
		display: grid;
		gap: 8rem;
	}

	.about-text {
		display: grid;
		gap: 1rem;
	}

	.about-text-list-item {
		list-style: disc;
		font-weight: bold;
		color: var(--color-primary-alt);
	}

	.about-benefit-list {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
	}

	.about-benefit-item {
		display: grid;
		gap: 1rem;
	}

	.about-benefit-item .cta-btn {
		margin-top: 2rem;
	}

	.about-img {
		width: 100%;
		height: 80vh;
		object-fit: cover;
		object-position: center;
		border-radius: .5rem;
		box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, .1);
	}

	.faq-list {
		width: 100%;
		display: grid;
		gap: 4rem;
		padding: 4rem 10%;
	}

	.faq-item {
		display: grid;
		gap: 1rem;
		position: relative;
		cursor: pointer;
	}

	.faq-item:not(:last-child)::after {
		content: "";
		width: 100%;
		height: 2px;
		position: absolute;
		bottom: -2rem;
		left: 0;
		background-color: var(--color-background-secondary);
	}

	.faq-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.faq-leading {
		display: flex;
		align-items: center;
		gap: .5rem;
	}

	.faq-question {
		font-weight: bold;
	}

	@media only screen and (max-width: 1024px) {
		#about {
			grid-template-columns: 1fr;
		}

		.about-img {
			height: 100%;
		}
	}

	@media only screen and (max-width: 1480px) {
		.benefit-list {
			grid-template-columns: 1fr;
			gap: 2rem;
			padding: 4rem 0 8rem 0;
		}

		.benefit-item:not(:last-child)::after {
			content: none;
		}
	}

	@keyframes scrollTilt {
		to {
			transform: scale(.75) rotateX(90deg);
		}
	}
</style>