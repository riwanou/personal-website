<script>
	import Navbar from "$lib/components/navbar.svelte";
</script>

<Navbar />
<slot />

<style lang="postcss">
	:global(html.dark) {
		@apply bg-slate-900 text-gray-100;
	}
	:global(html) {
		@apply bg-stone-50 text-black;
	}
</style>
