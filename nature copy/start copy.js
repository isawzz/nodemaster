onload = start;

var cv, cx, go = {}, FR = 30,isdirty = true;
const TREE={ created:false, jittering: false, len:100, depth:3, branching:[25,5,-25], init:tree_init};
DA.system = TREE;

async function start() {
	// await load_syms();
	// dHeader = mSection({ padding: 10, position:'relative' }, 'dHeader', 'Hello!', 'h1');
	// mPuppet('pineapple', dHeader, {position:'absolute', top:6},100);

	dToolbar = mToolbar(['tree', 'sp co', 'L-sys', 'jitter'], 'dToolbar');
+
	onclick_tree(); onclick_grow();
}

//#region tree
function add_fork(b) {
	for(const a of TREE.branching){
		branch_add(b, b.p[1], b.angle + toRadian(a));
	}
	b.done = true;
}
function tree_init() {
	let len = 100;
	let o = {
		done: false,
		p: [{ x: cv.width / 2, y: cv.height }, { x: cv.width / 2, y: cv.height - len }],
		t: 'branch',
		angle: toRadian(90),
		len: len,
		thickness: 10,
		color: 'sienna',
		age: 0,
	};
	go_register(o);
}
//#endregion 

//#region branch
function branch_add(b, pt, angle) {
	let len = b.len * .67;
	let x = pt.x + Math.cos(angle) * len;
	let y = pt.y - Math.sin(angle) * len;
	let age = b.age + 1;

	let o = {
		done: false,
		p: [pt, { x: x, y: y }],
		x: x,
		y: y,
		pbase: { x: x, y: y },
		t: 'branch',
		age: age,
		len: len,
		angle: angle,
		thickness: b.thickness * .75,
		color: colorMix(b.color, 'lime', 10), //(b.color,'red',20), //colorLight(b.color, 8),
	};
	go_register(o, b);

}
function draw_branch(o) {
	cStyle(cx, 'white', o.color, o.thickness, 'round');
	cLine(cx, o.p[0].x, o.p[0].y, o.p[1].x, o.p[1].y);
}
//#endregion

//#region flower
function draw_flower(x, y, color, angle = 0, petalCount = 1, lineWidth = 3, sz = 10) { //, fitScale, petalCount) {
	// col is the stroke color
	// linewidth is the thing to do with lines
	// fitScale is how well to fit the space. Less than one to fit the canvas
	// petalCount i will let you guess what that does.
	function createPetal(length, width) {

		const path = new Path2D();
		// draw outer line
		path.moveTo(0, 0);
		path.lineTo(length * 0.3, -width);
		path.lineTo(length * 0.8, -width);
		path.lineTo(length, 0);
		path.lineTo(length * 0.8, width);
		path.lineTo(length * 0.3, width);
		// close the path so that it goes back to start
		path.closePath();

		// create the line down the middle.
		path.moveTo(0, 0);
		path.lineTo(length, 0);

		return path;
	}
	function drawPetals(x, y, count, startAt, petal) {
		// x,y is center
		// count number of petals
		// startAt is the angle of the first
		const step = (Math.PI * 2) / count;
		cx.setTransform(1, 0, 0, 1, x, y); // set center
		cx.rotate(startAt);  // set start angle
		for (var i = 0; i < count; i += 1) {
			cx.stroke(petal);  // draw a petal
			cx.rotate(step);   // rotate to the next
		}
		cx.setTransform(1, 0, 0, 1, 0, 0);  // restore default
	}
	cx.strokeStyle = color;
	cx.lineWidth = lineWidth;
	const size = 50;// Math.min(cx.canvas.width, cx.canvas.height) * fitScale * 0.5;
	drawPetals(x, y, petalCount, angle, createPetal(sz, sz * .2)); //cx.canvas.width / 2, cx.canvas.height / 2, 5, 0, createPetal(size, size * 0.2));
	cx.beginPath();
	cx.arc(x, y, sz * .15, 0, Math.PI * 2); //cx.canvas.width / 2, cx.canvas.height / 2, size * 0.15, 0, Math.PI * 2);
	cx.fillStyle = color;
	cx.fill();
}
//#endregion

//#region leaf
function create_leaf(b) {
	pt = b.p[1];
	angle = b.angle;
	let len = b.len * .67;
	let x = pt.x + Math.cos(angle) * len;
	let y = pt.y - Math.sin(angle) * len;
	let age = b.age + 1;

	let o = {
		done: true,
		p: [pt], //, { x: x, y: y }],
		pbase: pt,
		x: pt.x,
		y: pt.y,
		t: 'leaf',
		age: age,
		len: len,
		angle: angle,
		thickness: 20,
		color: 'green',// colorDark(GREEN,50), //colorTrans('green',.9),
	};
	b.done = true;
	go_register(o, b);

}
function draw_leaf(o) {
	cStyle(cx, o.color, o.color, 1, null); //o.thickness, 'round');
	let [x, y] = [o.p[0].x, o.p[0].y];
	console.log('angle', o.angle);

	let [w, h] = [o.len * 1.5, o.len];
	cEllipse(cx, x, y, w, h, o.angle + 1);
	draw_flower(x, y, 'hotpink', -o.angle, 5, 1);

}
//#endregion

function clear_table() {

	go = {};
	isdirty=true;
	TREE.jittering=false;
	len=100;
	//if I leave Items, I can always reconstruct the tree?
	mClear('dTable'); 
	clear_timeouts();
}
function gameloop_start() {

	TO.iv = setInterval(go_draw, 1000 / FR);

}
function get_higher_order_type(t) {
	return t == 'branch' ? 'tree' : 'unknown';
}
function go_register(o, parent = null) {
	lookupAddToList(go, [o.t], o);
	o.draw = window['draw_' + o.t];
	if (parent) {
		lookupAddToList(parent, ['children'], o);
	} else {
		//register as a new structure in Items
		let id = getUID();
		let t = get_higher_order_type(o.t);
		lookupAddToList(Items, [t], { go: o, id: id, type: t, sz: o.len });
	}
	o.parent = parent;
	isdirty = true;
}
function go_draw() {
	if (!isdirty) return;
	//console.log('drawing');
	if (!TREE.jittering) isdirty = false;
	cClear(cv, cx);
	cStyle(cx, 'white', 'red', 10, 'round');
	for (const t in go) {
		for (o of go[t]) {
			if (TREE.jittering) {
				console.log('j')
				if (coin()) { o.p[0].x += Math.random(); o.p[0].y -= Math.random(); }
				else { o.p[0].x -= Math.random(); o.p[0].y += Math.random(); }
			}
			o.draw(o);
		}
	}
}











