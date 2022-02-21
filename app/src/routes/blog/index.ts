import type { RequestHandler } from "@sveltejs/kit";

const posts: Post[] = [
	{
		name: "First",
		content: "Hello, this is my first post"
	},
	{
		name: "Second",
		content: "Second post"
	}
];

export const get: RequestHandler = (request) => {
	return {
		body: { posts: posts },
		status: 200
	};
};
