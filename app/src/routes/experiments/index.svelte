<script>
	import Card from "$lib/components/card.svelte";
	import Footer from "$lib/components/footer.svelte";
	import PageTransition from "$lib/components/page-transition.svelte";
</script>

<head>
	<title>Experiments</title>
</head>

<PageTransition>
	<h1 class="mt-8 mb-14 text-center text-6xl">Experiments</h1>
	<div class="flex h-full flex-col justify-between">
		<div id="wrapper">
			<Card>First</Card>
			<Card>Second</Card>
			<Card>Third</Card>
			<Card>Fourth</Card>
			<Card>Funf</Card>
			<Card>Sixth</Card>
		</div>
		<Footer />
	</div>
</PageTransition>

<style lang="postcss">
	#wrapper {
		@apply grid;
		@apply w-full max-w-md;
		@apply mx-auto gap-3 px-10;
		@apply sm:max-w-3xl sm:grid-cols-2;
		@apply lg:max-w-screen-xl lg:grid-cols-3 lg:grid-rows-3;
	}
</style>
