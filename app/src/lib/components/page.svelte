<script>
	import Navbar from "$lib/components/navbar.svelte";
</script>

<div class="flex h-full flex-col">
	<Navbar />
	<slot />
</div>

<style lang="postcss">
	:global(html.dark) {
		@apply bg-slate-900 text-gray-100;
	}
	:global(html) {
		@apply duration-300 ease-in-out;
		@apply bg-stone-50 text-black;
	}
</style>
