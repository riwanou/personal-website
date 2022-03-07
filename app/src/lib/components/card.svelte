<script>
	let title = "placeholder title";
	let content = "placeholder content";
</script>

<a href="/" id="card" class="bg-stone-50 dark:bg-slate-700">
	<img src="" alt="" class="w-full" />
	<div class="bottom-0 w-full">
		<h1 class="mb-1 pt-2 text-center text-lg font-semibold">{title}</h1>
		<p class="mb-3 text-center">
			{content}
		</p>
	</div>
</a>

<style lang="postcss">
	#card {
		@apply relative h-full;
		@apply overflow-hidden rounded drop-shadow-lg;
		transition: background 0.35s;
	}
</style>
