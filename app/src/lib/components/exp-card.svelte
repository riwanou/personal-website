<script>
	import { fly } from "svelte/transition";
	export let delay = 0;
	export let experiment;
</script>

<a
	href={"experiments/" + experiment.path}
	id="card"
	sveltekit:prefetch
	class="shadow-lg dark:shadow-slate-800"
	in:fly={{ duration: 800, x: 10, delay: delay * 200 }}>
	<img src={experiment.image} alt={experiment.name + " background"} />
	<div id="desc">
		<time class="pt-2 text-sm font-thin">{experiment.date}</time>
		<h1 id="title">{experiment.name}</h1>
		<p class="mb-3">
			{experiment.sumary}
		</p>
		<slot />
	</div>
</a>

<style lang="postcss">
	#card {
		@apply relative;
		@apply rounded-xl;
		@apply hover:scale-[103%];
		@apply overflow-hidden transition duration-200;
		@apply border-white border-opacity-10;
	}

	@media (hover: hover) {
		#desc {
			@apply translate-y-full transition duration-300;
		}

		#card:hover #desc {
			@apply translate-y-0;
		}
	}

	#desc {
		@apply absolute bottom-0 w-full p-4;
		@apply text-left text-white drop-shadow-lg;
		background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.4));
	}

	#title {
		@apply mb-2 pt-1 text-lg font-semibold;
	}

	img {
		@apply relative w-full object-cover;
		aspect-ratio: 1/1.4;
		min-height: 0;
	}
</style>
