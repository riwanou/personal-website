<script lang="ts">
	import { fade } from "svelte/transition";
	import ThreejsScene from "$lib/components/threejs-scene.svelte";
	let path = "home";
</script>

<head>
	<title> Riwan Coeffic - Home </title>
	<meta name="description" content="Riwan's personal website" />
	<meta name="author" content="riwanou" />
	<link rel="stylesheet" href="/home.css" />
</head>

<ThreejsScene {path}>
	<div
		in:fade={{ duration: 400, delay: 400 }}
		class="mx-5 flex h-full flex-col items-center justify-center">
		<div class="flex flex-col">
			<p class="pb-6 text-4xl font-semibold">Hey, Welcome.<br /></p>
			<p class="pb-2 text-xl font-medium">My name is Riwan Coëffic.</p>
			<p class="max-w-xl break-words text-lg">
				I am a french computer-science student building stuff on the Web. Eating rice and
				implementing my ideas is my way of life. Feel free to check my last projects on
				<a class="link" href="https://github.com/riwanou" target="_blank">Github</a>.
			</p>
		</div>
		<a
			target="_self"
			href="/posts"
			class="my-10 block rounded-lg bg-indigo-600 px-4 py-2 text-center text-xl shadow-xl">Posts</a>
	</div>
</ThreejsScene>

<style lang="postcss">
	:global(html) {
		@apply bg-slate-900 text-gray-100;
	}

	.link {
		@apply inline-block font-medium decoration-green-500 hover:underline focus:underline;
	}
</style>
