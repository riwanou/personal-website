export async function get() {
	const postFiles = import.meta.glob("/src/posts/*.md");
	let posts = [];

	for (const [path, resolver] of Object.entries(postFiles)) {
		const post = await resolver();
		posts.push(post.metadata);
	}

	return {
		body: { posts },
		status: 200
	};
}
