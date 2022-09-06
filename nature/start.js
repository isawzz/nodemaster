
onload = start;

var cv, cx, iv, iv1, go = {}, FR = 30, isdirty = true; //go by type
async function start() {
	// await load_syms();
	// dHeader = mSection({ padding: 10, position:'relative' }, 'dHeader', 'Hello!', 'h1');
	// mPuppet('pineapple', dHeader, {position:'absolute', top:6},100);

	dToolbar = mToolbar('sp co', 'L-sys');

	mToolbar('addfork');

	onclick_sp_co();
}
function clear_table() {
	go={};
	mClear('dTable'); clearInterval(iv);
}
function onclick_sp_co() {
	clear_table();
	[cv, cx] = mCanvas('dTable', 500, 400, { bg: '#222' }); //make a canvas?

	gameloop();


	let len = 100;
	let o = {
		done: false,
		p: [{ x: cv.width / 2, y: cv.height }, { x: cv.width / 2, y: cv.height - len }], 
		t: 'branch', 
		angle: toRadian(90),
		len: len,
		thickness: 10,

	};
	go_register(o);

}
function gameloop() {
	iv = setInterval(go_draw, 1000 / FR);

	//iv1 = setInterval(onclick_addfork, 1000);
}
function go_register(o) { 
	lookupAddToList(go, [o.t], o); 
	o.draw = window['draw_' + o.t]; 
	isdirty = true; 
}
function go_draw() {
	if (!isdirty) return;
	console.log('drawing');
	isdirty = false;
	cClear(cv, cx);
	cStyle(cx, 'white', 'red', 10, 'round');
	for (const t in go) {
		for (o of go[t]) {
			o.draw(o);
		}
	}
}
function add_fork(b) {
	let pt = b.p[1];
	//let a1 = b.angle + toRadian(25);
	let len = b.len * .67;
	let thickness = b.thickness * .75;
	b.done = true;

	add_branch(pt,b.angle + toRadian(25),len,thickness);
	add_branch(pt,b.angle - toRadian(25),len,thickness);
}
function add_branch(pt,a1,len,thickness){
	// add left branch
	let x = pt.x + Math.cos(a1) * len;
	let y = pt.y - Math.sin(a1) * len;
	let o = { 
		done: false, 
		p: [pt, { x: x, y: y }], 
		t: 'branch', 
		len: len,
		angle: a1,
		thickness: thickness,
	 };
	go_register(o);

}
function draw_branch(o) {
	cLine(cx, o.p[0].x, o.p[0].y, o.p[1].x, o.p[1].y);
}
function onclick_addfork() {
	console.log('tree is',go)
	for (const o of go.branch){
		if (!o.done) {add_fork(o); break;}
	}
}











