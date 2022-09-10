
function tree_init(offx = 0, offy = 0, options = {}) {
	let o = {
		done: false,
		t: 'root',
		age: 0,
		x2: offx + cv.width / 2,
		y2: offy + cv.height,
		len: valf(options.len, 100),
		angle: toRadian(90),
		thickness: valf(options.thick, 20),
		color: valf(options.color, 'sienna'),
		depth: 5,
		branching: [25, 5, -25],
		dlen: .7,
		dthickness: .7,
		phase: 'spring',
		speed: { spring: 500, summer: 50, autumn: 25, winter: 1000 },
		animated: false,
	};
	return o;
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
				if (b.age < root.depth) {
					for (const a of root.branching) {
						let o = create_branch(b, b.angle + toRadian(a), root); lookupAddToList(C.items, [o.t], o);
					}
				} else {
					let o = create_leaf(b, root); lookupAddToList(C.items, [o.t], o);
				}
				C.changed = true;
				b.done = true;
			}
		}
		if (!C.changed) root.phase = 'summer';
	}
	else if (root.phase == 'summer') {

		let colors = ['limegreen','green','mediumseagreen','lightgreen','yellowgreen','olive','darkgoldenrod','golden','orange','chocolate','peru','sienna','tan','#b2846c','#32041c'];
		let alive = C.items.leaf.filter(x => x.color != arrLast(colors));
		if (isEmpty(alive)) {
			root.phase = 'autumn';
		} else {
			//console.log('falling',falling,C.changed)
			for (const b of alive) { 
				if (coin(25)) {let icolor=colors.indexOf(b.color)+1; b.color = colors[icolor]; }
			}
		}

		C.changed = true;
	}
	else if (root.phase == 'autumn') {
		C.changed = true;
		let falling = C.items.leaf.filter(x => x.y < cv.height);
		if (isEmpty(falling)) {
			C.changed = false; root.phase = 'winter';
		} else {
			//console.log('falling',falling,C.changed)
			for (const b of falling) { b.y += Math.random() * 3; }
		}
	}
	else if (root.phase == 'winter') {
		C.changed = true;
		cStyle(cx, 'red', 'red');
		cEllipse(cx, cv.width / 2, 100, 100, 25);
		root.phase = 'over';
	}
	else if (root.phase == 'over') { C.changed = false; }


	if (root.animated) TO.iv1 = setTimeout(tree_add, C.root.speed[C.root.phase]);
}
function tree_grow() {
	//animate tree growth

	C.root.animated = true;
	tree_add();
	
}
function tree_clear() {
	G_clear();
	onclick_menu_item('tree');
}

function create_branch(b, angle, root) {
	let len = b.len * root.dlen;
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
		thickness: b.thickness * root.dthickness,
		color: colorMix(b.color, 'lime', 10), //(b.color,'red',20), //colorLight(b.color, 8),
	};
	b.done = true;
	return o;

}
function branch_draw(o) {
	cStyle(cx, 'white', o.color, o.thickness, 'round');
	cLine(cx, o.x1, o.y1, o.x2, o.y2);
}

function create_leaf(b, root) {
	//console.log('b.angle', toDegree(b.angle))
	let o = {
		done: true,
		x: b.x2,
		y: b.y2,
		t: 'leaf',
		age: b.age + 1,
		len: b.len * root.dlen,
		angle: b.angle,
		thickness: 20,
		color: 'lawngreen',// colorDark(GREEN,50), //colorTrans('green',.9),
	};
	b.done = true;
	return o;
}
function leaf_draw(o) {
	cStyle(cx, o.color, o.color, 1, null); //o.thickness, 'round');
	let [x, y] = [o.x, o.y];
	//console.log('angle', o.angle);

	let [w, h] = [o.len * 1.5, o.len];
	cEllipse(cx, x, y, w, h, o.angle);
	//draw_flower(x, y, 'hotpink', -o.angle, 5, 1);

}





