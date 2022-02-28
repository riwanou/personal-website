<script>
	import { fade } from "svelte/transition";
	export let time = 400;
</script>

<main in:fade={{ delay: time, duration: time }} out:fade={{ duration: time }}>
	<slot />
</main>
