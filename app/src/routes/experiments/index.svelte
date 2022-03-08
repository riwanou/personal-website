<script>
	import { onMount } from "svelte";
	import ExpCard from "$lib/components/exp-card.svelte";
	import Footer from "$lib/components/footer.svelte";
	import PageTransition from "$lib/components/page-transition.svelte";
	import experimentsJSON from "./experiments.json";

	// transition key
	let show = false;
	onMount(() => (show = true));
</script>

<head>
	<title>Experiments</title>
</head>

<PageTransition>
	<h1 class="mt-8 mb-14 text-center text-6xl">Experiments</h1>
	<div class="flex h-full flex-col justify-between">
		<div id="wrapper">
			{#if show}
				{#each experimentsJSON as exp, i}
					<ExpCard
						title={exp.name}
						content={exp.sumary}
						link={"experiments/" + exp.path}
						img={exp.image}
						delay={i} />
				{/each}
			{/if}
		</div>
		<Footer />
	</div>
</PageTransition>

<style lang="postcss">
	#wrapper {
		@apply mx-auto grid gap-4 px-10;
		@apply sm:max-w-2xl lg:max-w-screen-lg xl:max-w-screen-xl;
		@apply grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
	}
</style>
