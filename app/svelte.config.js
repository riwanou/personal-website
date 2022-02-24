import mdsvexConfig from "./mdsvex.config.js";
import adapter from "@sveltejs/adapter-node";
import preprocess from "svelte-preprocess";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [".svelte", ...mdsvexConfig.extensions],

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	extensions: [".svelte", ".md"],
	preprocess: [mdsvex(mdsvexConfig), preprocess({ postcss: true })],

	onwarn: (warning, handler) => {
		const { code, frame } = warning;
		if (code === "css-unused-selector") return;

		handler(warning);
	},

	kit: {
		adapter: adapter(),
		inlineStyleThreshold: 1024
	}
};

export default config;
