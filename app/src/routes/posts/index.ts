export async function get() {
	const postFiles = import.meta.glob("/src/posts/*.md");
	let posts = [];

	for (const [, resolver] of Object.entries(postFiles)) {
		const post = await resolver();
		posts.push(post.metadata);
	}

	posts.sort((a, b) => {
		const d1 = new Date(a.date);
		const d2 = new Date(b.date);
		if (d1 > d2) return 1;
		if (d1 < d2) return -1;
		return 0;
	});

	return {
		body: { posts },
		status: 200
	};
}
