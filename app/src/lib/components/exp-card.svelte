<script>
	import { fly } from "svelte/transition";
	export let delay = 0;
	export let experiment;
</script>

<a
	href={"experiments/" + experiment.path}
	id="card"
	in:fly={{ duration: 1000, x: 10, delay: delay * 300 }}>
	<img src={experiment.image} alt={experiment.name + " background"} />
	<div id="desc">
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
		@apply rounded-xl shadow-lg;
		@apply hover:scale-[103%];
		@apply overflow-hidden transition-transform duration-200;
	}

	#card:hover #desc {
		@apply translate-y-0;
	}

	#desc {
		@apply translate-y-full transition duration-300;
		@apply absolute bottom-0 w-full p-4;
		@apply text-left text-white drop-shadow-lg;
		background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
	}

	#title {
		@apply mb-3 pt-2 text-lg font-bold;
	}

	img {
		@apply relative aspect-[1/1.4] object-cover;
	}
</style>
