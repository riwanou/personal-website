import { posts } from ".";

export async function get({ params }) {
	const post = posts.filter((res) => res.uid === params.slug)[0];

	if (!post) {
		return {
			status: 404
		};
	}

	return {
		body: { post: post },
		status: 200
	};
}
