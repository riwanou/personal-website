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
	<div class="flex flex-col items-center py-12">
		<article class="prose dark:prose-invert prose-slate ">
			{@html post.html}
		</article>
	</div>
	<Footer />
</PageTransition>

<style lang="postcss">
	article {
		@apply prose-lg mx-5;
	}
</style>
