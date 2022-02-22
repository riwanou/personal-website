const modules = import.meta.glob("../../posts/*.md");
let promisePool = [];

for (let [path, module] of Object.entries(modules)) {
	module().then(({ metadata }) => {
		console.log(metadata);
	});
	promisePool.push(module().then((module) => module.default));
}

export async function get() {
	const posts = await Promise.all(promisePool);

	console.log(posts[0]);

	const a = posts[0].render();

	return {
		body: { posts: a },
		status: 200
	};
}
