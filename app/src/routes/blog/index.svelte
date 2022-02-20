<script>
	import { theme } from "$lib/utils/dark-mode";

	const swapTheme = () => {
		if ($theme === "light") $theme = "dark";
		else $theme = "light";
	};
</script>

<head>
	<title>Blog</title>
</head>

<div class="flex flex-col">
	<h1 class="text-6xl text-center mt-5">Blog</h1>
	<button
		class="mt-8 self-center dark:bg-emerald-500 bg-emerald-400 px-4 py-1 rounded-lg"
		on:click={swapTheme}>Swap theme</button>
</div>

<style lang="postcss">
	:global(html.dark) {
		@apply bg-slate-900 text-gray-100;
	}
</style>
