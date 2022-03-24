<script>
	import { theme } from "$lib/utils/dark-mode";
	import { create_in_transition } from "svelte/internal";
	import { fly } from "svelte/transition";

	let button;
	let anim;

	const swapTheme = () => {
		if ($theme === "light") $theme = "dark";
		else $theme = "light";
		anim = create_in_transition(button, fly, { y: -10, duration: 600 });
		anim.start();
	};
</script>

<div id="navbar">
	<div id="container">
		<div class="flex gap-2 sm:gap-5">
			<a target="_self" href="/">Home</a>
			<a href="/posts">Posts</a>
			<a href="/experiments">Experiments</a>
		</div>
		<button bind:this={button} on:click={swapTheme}>Swap theme</button>
	</div>
</div>

<style lang="postcss">
	#navbar {
		@apply sticky top-0 py-4;
		@apply z-10;
		@apply backdrop-blur-md;
		mask: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 97%, rgba(0, 0, 0, 0) 100%);
	}

	#container {
		@apply mx-auto flex max-w-xl px-2 sm:px-5;
		@apply flex items-center justify-between;
		@apply text-lg;
	}
</style>
