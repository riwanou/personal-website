<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { createScene, resizeScene, destroyScene, updateScene, renderScene } from "$threejs/scene";

	let resize: () => void;
	let destroy: () => void;
	let canvas: HTMLCanvasElement;
	let load = false;
	export let path = "";

	onMount(async () => {
		// please make dynamic string import work one day ;(
		const module =
			(path === "home" && (await import("$threejs/home/home"))) ||
			(path === "bubble" && (await import("$threejs/experiments/bubble"))) ||
			(path === "second" && (await import("$threejs/experiments/second"))) ||
			(path === "third" && (await import("$threejs/experiments/third"))) ||
			(await import("$threejs/experiments/second"));

		// handle resizing of browser window
		resize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
			resizeScene(width, height, module.resize);
		};

		// clean up
		destroy = () => {
			console.log("clean up");
			destroyScene(module.destroy);
			window.removeEventListener("resize", resize);
		};

		// init scene
		await createScene(canvas, module.init, module.load);
		canvas.classList.remove("invisible");
		load = true;

		// handle resize
		resize();
		window.addEventListener("resize", resize);

		// update loop
		const run = () => {
			updateScene(module.update);
			renderScene();
			window.requestAnimationFrame(run);
		};
		run();
	});

	onDestroy(() => {
		if (destroy) destroy();
	});
</script>

<canvas bind:this={canvas} class="invisible absolute top-0 transition-opacity duration-500" />

{#if load}
	<slot />
{/if}

<style lang="postcss">
	:global(.invisible) {
		@apply opacity-0;
	}

	:global(.lil-gui) {
		@apply h-auto max-h-min;
	}

	:global(:not(canvas)) {
		z-index: 10;
		@apply text-gray-100;
	}
</style>
