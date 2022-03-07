<script>
	import { theme } from "$lib/utils/dark-mode";
	import { fly } from "svelte/transition";

	let updateButton = false;

	const swapTheme = () => {
		if ($theme === "light") $theme = "dark";
		else $theme = "light";
		updateButton = !updateButton;
	};
</script>

<div id="navbar">
	<div id="container">
		<div class="flex gap-5">
			<a target="_self" href="/">Home</a>
			<a href="/posts">Posts</a>
			<a href="/experiments">Experiments</a>
		</div>
		{#key updateButton}
			<button in:fly|local={{ y: -10, duration: 400 }} on:click={swapTheme}>Swap theme</button>
		{/key}
	</div>
</div>

<style lang="postcss">
	#navbar {
		@apply sticky top-0 py-4;
		@apply z-10 shadow-md;
		@apply backdrop-blur-md;
		mask: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 97%, rgba(0, 0, 0, 0) 100%);
	}

	#container {
		@apply mx-auto flex max-w-xl px-5;
		@apply flex items-center justify-between;
		@apply text-lg;
	}
</style>
