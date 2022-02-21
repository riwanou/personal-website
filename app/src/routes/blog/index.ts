export const posts: Post[] = [
	{
		uid: "1",
		name: "First",
		content: "Hello, this is my first post"
	},
	{
		uid: "2",
		name: "Second",
		content: "Second post"
	}
];

export async function get() {
	return {
		body: { posts: posts },
		status: 200
	};
}
