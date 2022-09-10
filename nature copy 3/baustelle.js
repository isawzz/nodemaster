
function tree_funcs() {
	const options = { len: 100, dlen: .7, depth: 5, wline: 20, dwline: .7, branching: [25, 5, -25], phase: 'spring' };
	const initialstate = { root: null, branches: [], leaves: [] };
	function clear(c) { }
	function init(c) {
		//mToolbar(buttons, handler, dParent, styles, id, classes) {
		addKeys(options, c);
		addKeys(jsCopy(initialstate), c);

		let d = mDiv(dTable, { w: '100%', display: 'flex' });
		mToolbar(['add', 'grow', 'clear'], ()=>handle_command(c), d, { bg: 'red' });
		mTogglebar({ jitter: false }, flag_toggle, { bg: 'green' }, { bg: '#eee' }, d, { bg: 'blue' });
	}
	function add(c) {
		if (!c.root) {
			add_stem();
		} else {
			c.changed = false;
			for (const b of c.branches) {
				if (!b.done) {
					if (b.age < c.depth) { for (const a of chis.branching) { branch_add(b, b.angle + toRadian(a)); } }
					else create_leaf(b);
					cEllipse.changed = true;
					b.done = true;
				}
			}
		}
	}
	function draw() { }
	function grow() { }

	return { clear, init, add, draw, grow };

}

function default_system() {
	const options = {};
	const initialstate = {};
	function clear() { }
	function init() { }
	function add() { }
	function draw() { }
	function grow() { }
	return { options, initialstate, clear, init, add, draw, grow };
}










