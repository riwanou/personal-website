<script>
	import { theme } from "$lib/utils/dark-mode";

	const swapTheme = () => {
		if ($theme === "light") $theme = "dark";
		else $theme = "light";
	};

	export let posts;
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

<div class="flex flex-col justify-center m-5 gap-3 mt-14">
	{#each posts as { title, slug, resume }, i}
		<a
			class="self-center w-1/2 bg-slate-100 dark:bg-slate-700 p-2 pb-3 rounded-md flex flex-col gap-1 shadow-sm"
			href="blog/{slug}">
			<h2 class="text-xl">{title}</h2>
			<p>{resume}</p>
		</a>
	{/each}
</div>
