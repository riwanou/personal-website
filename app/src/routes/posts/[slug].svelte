<script lang="ts">
	export let post;
	let data = post.metadata;
</script>

<head>
	<title>{data.title}</title>
	<meta name="summary" content={data.summary} />
	<meta name="date" content={data.date} />
</head>

<!-- <h1>{data.title}</h1> -->
<div class="flex flex-col items-center py-10">
	<article class="prose dark:prose-invert py-10">
		{@html post.html}
	</article>
</div>

<style lang="postcss">
	article {
		@apply prose-slate prose-lg;
	}
</style>
