import { writable } from "svelte/store";

// theme store
const theme = writable("");
const userSystemPreference = "(prefers-color-scheme: dark)";

// set dark or light theme
function setDarkTheme(dark: boolean): void {
	// add dark class to html element
	if (dark) {
		localStorage.theme = "dark";
		document.documentElement.classList.add("dark");
	} else {
		localStorage.theme = "light";
		document.documentElement.classList.remove("dark");
	}
	// set the store with the local storage theme
	theme.set(localStorage.theme);
}

// update theme based on store
function updateTheme(themeValue: string): void {
	switch (themeValue) {
		case "dark":
		case "light":
			setDarkTheme(themeValue == "dark");
			break;
		case "system":
			setDarkTheme(window.matchMedia(userSystemPreference).matches);
			break;
	}
}

export { theme, setDarkTheme, userSystemPreference, updateTheme };
