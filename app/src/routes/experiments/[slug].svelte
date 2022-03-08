<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { page } from "$app/stores";
	import Footer from "$lib/components/footer.svelte";
	import PageTransition from "$lib/components/page-transition.svelte";
	import { createScene, resizeScene, destroyScene, updateScene, renderScene } from "$threejs/scene";

	let resize: () => void;
	let destroy: () => void;
	let canvas: HTMLCanvasElement;
	let load = false;
	const path = $page.params.slug;

	onMount(async () => {
		// please make dynamic string import work one day ;(
		const module =
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

<head>
	<title>{$page.params.slug}</title>
</head>

<canvas bind:this={canvas} class="invisible absolute top-0 -z-10 transition-opacity duration-500" />

{#if load}
	<PageTransition>
		<div class="flex h-full flex-col justify-between text-black">
			<a id="link" href="/experiments">Go back</a>
			<div />
			<Footer />
		</div>
	</PageTransition>
{/if}

<style lang="postcss">
	:global(.invisible) {
		@apply opacity-0;
	}

	#link {
		@apply p-4 text-center text-xl;
		@apply transition-transform active:-translate-y-1;
	}
</style>
