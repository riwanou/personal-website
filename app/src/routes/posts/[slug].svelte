<script lang="ts">
	import Footer from "$lib/components/footer.svelte";
	import PageTransition from "$lib/components/page-transition.svelte";

	export let post;
	let data = post.metadata;
</script>

<head>
	<title>{data.title}</title>
	<meta name="summary" content={data.summary} />
	<meta name="date" content={data.date} />
</head>

<PageTransition>
	<div class="flex h-full flex-col items-center justify-between pt-12">
		<article class="prose dark:prose-invert prose-slate">
			{@html post.html}
		</article>
		<Footer />
	</div>
</PageTransition>

<style lang="postcss">
	article {
		@apply prose-lg mx-5;
	}
</style>
