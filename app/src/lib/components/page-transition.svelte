<script>
	import { fade } from "svelte/transition";
	export let time = 400;
</script>

<main in:fade={{ duration: time }} class="flex h-full flex-col">
	<slot />
</main>
