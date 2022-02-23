<script lang="ts">
	export let post;
	let data = post.metadata;
	console.log(data);
</script>

<head>
	<title>{data.title}</title>
	<meta name="summary" content={data.summary} />
	<meta name="date" content={data.date} />
</head>

<!-- <h1>{data.title}</h1> -->
<div class="flex flex-col items-center py-10">
	<a class="rounded-lg bg-emerald-400 py-2 px-4 text-xl dark:bg-emerald-500 " href="/blog">Home</a>
	<article class="prose dark:prose-invert py-10">
		{@html post.html}
	</article>
</div>

<style lang="postcss">
	article {
		@apply prose-slate prose-lg;
	}
</style>
