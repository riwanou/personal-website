<script lang="ts">
	import { onMount } from "svelte";
	import { fly, fade } from "svelte/transition";
	import { quadOut } from "svelte/easing";
	import PageTransition from "$lib/components/page-transition.svelte";
	import Footer from "$lib/components/footer.svelte";

	// posts list from server
	export let posts;

	// transition key
	let show = false;
	onMount(() => (show = true));
</script>

<head>
	<title>Posts</title>
</head>

<PageTransition>
	<div class="flex flex-col">
		<h1 class="mt-5 text-center text-6xl">Posts</h1>
	</div>

	<div class="m-1 mt-14 flex flex-col justify-center gap-3">
		{#if show}
			{#each posts as { title, slug, summary, date }, i}
				<a
					in:fly={{ duration: 700, y: 10, easing: quadOut, delay: i * 200 + 300 }}
					class="bg-stone-100 dark:bg-slate-700"
					id="post"
					href="posts/{slug}">
					<time class="text-sm font-thin">{date}</time>
					<h2 class="text-xl">{title}</h2>
					<p>{summary}</p>
				</a>
			{/each}
		{/if}
	</div>

	{#if show}
		<Footer />
	{/if}
</PageTransition>

<style lang="postcss">
	#post {
		transition: background 0.35s;
		@apply flex w-10/12 max-w-xl flex-col gap-1 self-center;
		@apply rounded-md p-2 pb-3 shadow-sm;
	}
</style>
