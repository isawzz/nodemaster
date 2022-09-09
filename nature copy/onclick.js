
var changed = true;
function onclick_add_layer() {
	let sys=DA.system;
	if (nundef(sys)) {
		return;
	}
	if (!DA.system.created) { DA.system.init(); }
	else {
		changed = false;
		for (const o of go.branch) {
			if (!o.done) { changed = true; if (o.age < TREE.depth) add_fork(o); else add_leaf(o); break; }
		}
	}
}
function onclick_grow() {

	//TO.iv1 = setInterval(onclick_add_layer, 1000/FR);
	//let x = MAXBRANCHES + 1;	while (x-- > 0) onclick_add_layer();

	while (changed) onclick_add_layer();
	if (!changed) console.log("DONE!");
	//else onclick_add_layer();


}
function onclick_jitter() { TREE.jittering = !TREE.jittering; }
function onclick_tree() {
	clear_table();
	mToolbar(['add layer', 'grow'], 'dTable');
	[cv, cx] = mCanvas('dTable', 500, 400, { bg: '#222' }); //make a canvas?

	gameloop_start();

	//init_tree();

}

