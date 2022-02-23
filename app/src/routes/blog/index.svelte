<script lang="ts">
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
	<h1 class="mt-5 text-center text-6xl">Blog</h1>
	<button
		class="mt-8 self-center rounded-lg bg-emerald-400 px-4 py-1 dark:bg-emerald-500"
		on:click={swapTheme}>Swap theme</button>
</div>

<div class="m-5 mt-14 flex flex-col justify-center gap-3">
	{#each posts as { title, slug, summary, date }, i}
		<a
			class="flex w-1/2 flex-col gap-1 self-center rounded-md bg-slate-100 p-2 pb-3 shadow-sm dark:bg-slate-700"
			rel="prefetch"
			href="blog/{slug}">
			<time class="text-sm font-thin">{date}</time>
			<h2 class="text-xl">{title}</h2>
			<p>{summary}</p>
		</a>
	{/each}
</div>
