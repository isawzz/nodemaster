
function tree_system() {
	const options = {
		len: 100,
		dlen: .7,
		depth: 5,
		thickness: 20,
		dthickness: .7,
		branching: [25, 5, -25],
		created: false,
		phase: 'spring',

	}
	const state = { root: null, branches: [], leaves: [] };
	function init() {
		//mToolbar(buttons, handler, dParent, styles, id, classes) {
		addKeys(this.options, G);
		addKeys(this.state, G);

		let d1 = mDiv(dTable, { w: '100%', display: 'flex' });
		mToolbar(['add', 'grow', 'reset'], handle_command, d1, { bg: 'red' });
		mTogglebar({ jitter: false }, flag_toggle, { bg: 'green' }, { bg: '#eee' }, d1, { bg: 'blue' });

	}
	function add() {
		if (!G.root) {
			add_stem();
		} else {
			G.changed = false;
			for (const b of G.branches) {
				if (!b.done) {
					if (b.age < G.depth) { for (const a of G.branching) { branch_add(b, b.angle + toRadian(a)); } }
					else create_leaf(b); 
					G.changed = true;
					b.done = true;
				}
			}
		}
	}
	function draw() { }
	function grow() { }
	function reset() { }

	return { options, state, init, add, draw, grow, reset };

}

function default_system() {
	const options = {};
	function init() { }
	function add() { }
	function draw() { }
	function grow() { }
	function reset() { }

	return { options, init, add, draw, grow, reset };

}










