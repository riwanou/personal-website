<script lang="ts">
	import { onMount, afterUpdate } from "svelte";
	import { theme, setDarkTheme, userSystemPreference, updateTheme } from "../utils/dark-mode";

	// update theme when user system preference changes
	function updatePreferenceTheme(darkTheme) {
		setDarkTheme(darkTheme.matches);
	}

	// update theme when store is updated
	afterUpdate(() => {
		updateTheme($theme);
	});

	onMount(() => {
		// get user preferences
		let systemTheme = matchMedia(userSystemPreference);
		// user system preferences changed?
		systemTheme.addEventListener("change", updatePreferenceTheme);
		// set theme in store
		theme.set(localStorage.theme);
		return () => {
			// stop checking for system preferences
			systemTheme.removeEventListener("change", updatePreferenceTheme);
		};
	});
</script>

<svelte:head>
	<script>
		// get user system theme and set it (avoid white flash for dark mode)
		if (window) {
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				localStorage.theme = "dark";
				document.documentElement.classList.add("dark");
			} else {
				localStorage.theme = "light";
				document.documentElement.classList.remove("dark");
			}
		}
	</script>
</svelte:head>
