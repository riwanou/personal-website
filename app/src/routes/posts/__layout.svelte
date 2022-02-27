<script>
	import DarkMode from "$lib/components/dark-mode.svelte";
	import Navbar from "$lib/components/navbar.svelte";
</script>

<Navbar />
<DarkMode />
<slot />

<style lang="postcss">
	:global(html.dark) {
		@apply bg-slate-900 text-gray-100;
	}
	:global(html) {
		@apply bg-stone-50;
	}
</style>
