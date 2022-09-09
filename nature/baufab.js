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
					if (b.age < c.depth) { for (const a of chis.branching) { add_branch(b, b.angle + toRadian(a)); } }
					else add_leaf(b);
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

function add_stem(){}{

}
function add_branch(b, angle) {
	let len = b.len * .67;
	let x = b.x2 + Math.cos(angle) * len;
	let y = b.y2 - Math.sin(angle) * len;
	let age = b.age + 1;

	let o = {
		done: false,
		x1: b.x2,
		y1: b.y2,
		x2: x,
		y2: y,
		x: x,
		y: y,
		t: 'branch',
		age: age,
		len: len,
		angle: angle,
		thickness: b.thickness * .75,
		color: colorMix(b.color, 'lime', 10), //(b.color,'red',20), //colorLight(b.color, 8),
	};
	go_register(o, b);

}


//eg., branch
class M0_Primitive {
	constructor() { this.init(); }
	clear() { this.go = {}; gameloop_stop(); clear_timeouts(); mClear('dTable'); }
	init() { addKeys({ created: false, running: false, changed: true }, this); }
	draw() { }
}
//eg., tree
class M0_Complex {
	constructor() { }
	clear() { this.go = {}; gameloop_stop(); clear_timeouts(); mClear('dTable'); G = null; }
	init() { addKeys({ created: false, running: false, changed: true }, this); }
	draw() { }
}













