onload = start;

async function start() {
	await load_syms();

	dHeader = mSection({ bg: 'red', padding: 10 }, 'dHeader', 'Hello!', 'h1');
	mButton('create', createInstance, dHeader);
	mButton('delete', deleteInstance, dHeader);

	mPuppet('badger', 'dHeader', { position: 'absolute', top: 0, left: 0 })

}
















