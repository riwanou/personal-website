<script>
	import { fly } from "svelte/transition";
	export let title = "placeholder title";
	export let content = "placeholder content";
	export let link = "/";
	export let img = "";
	export let delay = 0;
</script>

<a href={link} id="card" in:fly={{ duration: 1000, x: 10, delay: delay * 300 }}>
	<img src={img} alt={title + "background"} />
	<div class="absolute bottom-0 w-full text-white">
		<h1 class="mb-1 pt-2 text-center text-lg font-semibold">{title}</h1>
		<p class="mb-3 text-center">
			{content}
		</p>
		<slot />
	</div>
</a>

<style lang="postcss">
	#card {
		@apply relative;
		@apply overflow-hidden rounded-2xl shadow-lg;
		@apply transition-transform duration-200 hover:scale-[103%];
	}

	img {
		@apply relative aspect-[1/1.4] object-cover;
	}
</style>
