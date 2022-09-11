const DEPTH = 6;
const BRANCHING = [-25, 5, 25];

function tree_init(offx = 0, offy = 0, options = {}) {
	let root = {
		done: false,
		t: 'root',
		age: 0,
		p2: { x: offx + cv.width / 2, y: offy + cv.height },
		len: valf(options.len, 100),
		angle: toRadian(90),
		thickness: valf(options.thick, 20),
		color: valf(options.color, 'sienna'),
		depth: DEPTH, // 6
		branching: BRANCHING, // [25, 5, -25],
		dlen: .7,
		dthickness: .7,
		phase: 'spring',
		speed: { spring: 500, summer: 100, autumn: 25, winter: 100, over: 2000 },
		animated: false,
		jitter: false,
	};
	return root;
}
function tree_add() {
	let root = C.root;
	if (root.phase == 'spring') {
		C.changed = false;
		assertion(root, 'ROOT IS NULL BEI TREE_ADD!!!!!!!!!!!!!')
		if (!root.done) {
			let b = create_branch(root, root.angle, root);
			lookupAddToList(C.items, [b.t], b);
			C.changed = true;
		} else {
			for (const b of C.items.branch.filter(x => !x.done)) {
				if (b.age < root.depth) { //-rNumber(0,1)) {
					let br = root.branching; //rChoose(root.branching,rNumber(2,4));
					for (const a of br) {
						let o = create_branch(b, b.angle + toRadian(a), root); lookupAddToList(C.items, [o.t], o);
					}
				} else {
					let o = create_leaf(b, root); lookupAddToList(C.items, [o.t], o);
				}
				C.changed = true;
				root.maxage = b.age + 1;
				b.done = true;
			}
		}
		if (!C.changed) { root.minage = 0; root.phase = 'summer'; }
	}
	else if (root.phase == 'summer') {
		let colors = ['darkgreen', 'olive', '#8B9216', '#A79F0F', '#EDA421', '#E98604', '#DF3908', '#C91E0A', '#8C584A'];
		let changed = mutate_colors('leaf', colors);
		if (!changed) root.phase = 'autumn';
		root.jitter = true;
		C.changed = true;
	}
	else if (root.phase == 'autumn') {
		root.jitter = false;
		C.changed = true;
		let falling = C.items.leaf.filter(l => l.p.y < cv.height);
		if (isEmpty(falling)) {
			C.changed = false; root.phase = 'winter';
		} else {
			for (const b of falling) { b.p = { x: b.p.x + Math.random() * .51, y: b.p.y + Math.random() * 3 }; }
		}
	}
	else if (root.phase == 'winter') {
		let colors = ['#8E2100', '#5C1306', '#371C0F', '#1C1B19'];
		let changed = mutate_colors('branch', colors);
		if (!changed) root.phase = 'over';
		C.changed = true;
	}
	else if (root.phase == 'over') { C.changed = false; tree_clear(); }


	if (root.animated) TO.iv1 = setTimeout(tree_add, C.root.speed[C.root.phase]);
}
function tree_grow() { C.root.animated = true; tree_add(); }
function tree_clear() { G_clear(); onclick_menu_item('tree'); }

function create_branch(b, angle, root) {
	let len = b.len * root.dlen;
	let x = b.p2.x + Math.cos(angle) * len;
	let y = b.p2.y - Math.sin(angle) * len;
	let age = b.age + 1;

	let o = {
		done: false,
		p1: b.p2,
		p2: { x: x, y: y },
		x: x,
		y: y,
		t: 'branch',
		age: age,
		len: len,
		angle: angle,
		thickness: b.thickness * root.dthickness,
		color: colorMix(b.color, 'lime', 3),
	};
	b.done = true;
	return o;

}
function branch_draw(o) {
	cStyle(cx, 'white', o.color, o.thickness, 'round');
	if (C.root.jitter) cLine(cx, o.p1.x, o.p1.y, o.p2.x + Math.random() * 2 - 1, o.p2.y + Math.random() * 2 - 1);
	else cLine(cx, o.p1.x, o.p1.y, o.p2.x, o.p2.y);
}

function create_leaf(b, root) {
	let o = {
		done: true,
		p: b.p2,
		x: b.p2.x,
		y: b.p2.y,
		t: 'leaf',
		age: b.age + 1,
		len: b.len * root.dlen,
		angle: b.angle,
		thickness: 20,
		color: 'lawngreen',
	};
	b.done = true;
	return o;
}
function leaf_draw(o) {
	cStyle(cx, o.color, o.color, 1, null);
	let [x, y] = [o.p.x, o.p.y];
	let [w, h] = [o.len * 1.5, o.len];
	cEllipse(cx, x, y, w, h, o.angle);
}

function mutate_colors(type, colors) {
	//returns true if any color was changed
	let items = C.items[type];
	let changed = false;
	let lastcolor = arrLast(colors);
	for (const item of items) {
		if (item.color == lastcolor) continue;
		changed = true;
		if (coin()) continue;
		let i = colors.indexOf(item.color) + 1;
		item.color = colors[i];
		if (type == 'branch') item.thickness -= 1.5;
	}
	return changed;
}


