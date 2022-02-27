<script>
	import "../app.css";
	import DarkMode from "$lib/components/dark-mode.svelte";
</script>

<DarkMode />
<slot />

<style lang="postcss">
	:global(html, body, body > div) {
		@apply h-full;
	}
</style>
