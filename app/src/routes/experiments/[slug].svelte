<script>
	import ThreejsScene from "$lib/components/threejs-scene.svelte";
	import PageTransition from "$lib/components/page-transition.svelte";
	import Footer from "$lib/components/footer.svelte";
	import { page } from "$app/stores";
	let path = $page.params.slug;
</script>

<head>
	<title>{path}</title>
</head>

<ThreejsScene {path}>
	<PageTransition>
		<div class="pointer-events-none flex h-full flex-col justify-between text-black">
			<a id="link" target="_self" href="/experiments">Go back</a>
			<Footer />
		</div>
	</PageTransition>
</ThreejsScene>

<style lang="postcss">
	#link {
		@apply p-4 text-center text-xl;
		@apply pointer-events-auto transition-transform active:-translate-y-1;
	}
</style>
