export async function get({ params }) {
	const postFiles = import.meta.glob("/src/posts/*.md");
	let post;

	// search for post with slug attribute
	for (const [path, resolver] of Object.entries(postFiles)) {
		const res = await resolver();
		// found the markdown file with specified slug
		if (res.metadata.slug === params.slug) {
			post = { html: res.default.render().html, metadata: res.metadata };
			break;
		}
	}

	// post no founded
	if (!post) {
		return { status: 404 };
	}

	return {
		status: 200,
		body: { post }
	};
}
