<template>
    <div>
        <section class="wrapper">
            <img src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?w=2000">
        </section>
        <section></section>
    </div>
</template>

<script setup>
    if (process.client) {
        const wrapper = window.document.querySelector(".wrapper");

        function updateScroll() {
            const relativeScrollPosition = Math.min(window.scrollY, wrapper.scrollHeight);
            const value = relativeScrollPosition / wrapper.scrollHeight;
            document.body.style.setProperty("--relative-scroll", value);
        }

        function handleScroll() {
            requestAnimationFrame(updateScroll);
        }

        window.addEventListener("scroll", handleScroll);
    }
</script>

<style scoped>
    section {
		min-height: 100vh;
	}

	.wrapper {
		display: grid;
		place-items: center;
		gap: 3rem;
		padding: 5% 10%;
		perspective: 100vw;
	}

	img {
		width: 100%;
		height: 100%;
		border-radius: .5rem;
		box-shadow: 0 8px 20px 0 rgba(0, 0, 0, .5);
		animation: perspective 1s linear infinite;
	  	animation-play-state: paused;
	  	animation-delay: calc(var(--relative-scroll) * -1s);
	}

	@keyframes perspective {
		to {
			transform: scale(.75) rotateX(90deg);
		}
	}
</style>