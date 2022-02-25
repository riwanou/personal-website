<script lang="ts">
	import { createScene, destroyScene, renderScene } from "$threejs/main";
	import { onMount } from "svelte";

	let resize: () => void;
	let canvas: HTMLCanvasElement;

	onMount(() => {
		resize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight - canvas.offsetTop;
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
		};

		resize();
		window.addEventListener("resize", resize);

		createScene(canvas);
		renderScene();

		return () => {
			destroyScene();
			window.removeEventListener("resize", resize);
		};
	});
</script>

<head>
	<title> Riwan Coeffic - Home </title>
	<meta name="description" content="Riwan's personal website" />
	<meta name="author" content="riwanou" />
</head>

<canvas bind:this={canvas} class="absolute -z-10" />

<div class="flex justify-center">
	<div class="mx-5 my-16 flex flex-col">
		<p class="pb-6 text-4xl font-semibold">Hey, Welcome.<br /></p>
		<p class="pb-2 text-xl font-medium">My name is Riwan Coëffic.</p>
		<p class="max-w-xl break-words text-lg">
			I am a french computer-science student building stuff on the Web. Eating rice and implementing
			my ideas is my way of life. Feel free to check my last projects on
			<a class="link" href="https://github.com/riwanou" target="_blank">Github</a>.
		</p>
	</div>
</div>

<style lang="postcss">
	.link {
		@apply inline-block font-medium decoration-green-500 hover:underline focus:underline;
	}
</style>
