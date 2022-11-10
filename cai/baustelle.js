
function ccanvas(dParent, styles, bstyles, play, pause, origin = 'cc') {
	//origin can be a point {x,y} or any of tl,tc,tr,cl,[cc],cr,bl,bc,br
	let o = mCanvas(dParent, styles, bstyles, play, pause);
	[this.cv, this.cx, this.play, this.pause] = [o.cv, o.cx, o.play, o.pause];
	let [w, h] = [this.w, this.h] = [this.cv.width, this.cv.height];
	this.defaultsize = 20;

	this.origin = cv_init_origin(this, origin);
	this.cx.translate(this.origin.x, this.origin.y);

	this.maxx = w - this.origin.x; this.minx = this.maxx - w;
	this.maxy = h - this.origin.y; this.miny = this.maxy - h;

	//console.log('CCanvas', this.minx, this.maxx, this.miny, this.maxy)
	this.items = [];

}
function cv_init_origin(canvas, origin) {
	let cv = canvas.cv;
	if (nundef(origin)) origin = 'cc';
	let pt = origin;
	if (isString(origin)) {
		let v = origin[0], h = origin[1];
		let y = v == 't' ? 0 : v == 'c' ? cv.height / 2 : cv.height;
		let x = h == 'l' ? 0 : h == 'c' ? cv.width / 2 : cv.width;
		pt = { x: x, y: y };
	}
	return pt;

}
function default_item_serializer(o) { return copyKeys(o, {}, { live: true }); }
function detect_size_from_styles(st = {}, defsize = 50) {
	return [valf(st.w, st.sz, defsize), valf(st.w, st.sz, defsize)];
}
function dict_augment(di,o){addKeys(o,di); return di;}
function dict_remove(di,keys){
	//except sollte auch als list funktionieren!!!
}
function draw_on_canvas(cx, item) {
	if (isdef(item.draw)) { item.draw(cx, item); }
	else {
		cx.save();
		let st = item.styles;
		let [x, y, w, h, a, color] = [valf(st.x, 0), valf(st.y, 0), valf(st.w, 30), valf(st.h, 30), valf(st.a, 0), valf(st.bg, RED)];
		cx.translate(x, y);
		cx.rotate(toRadian(a));
		cEllipse(0, 0, w, h, { bg: colorFrom(color) }, 0, cx); //default draw
		cx.restore();
	}

}
function draw_on_div(dParent, item) {
	if (isdef(item.draw)) { item.draw(dParent, item); }
	else {
		let d = mDiv(dParent, item.styles);
		iAdd(item, { div: d });
	}

}
function game_add_default_item(ev) {
	evNoBubble(ev);
	let sz = 50;
	let [x, y] = [ev.clientX - sz / 2, ev.clientY - sz / 2]; //js mouse position of click event
	let item = { styles: { position: 'absolute', x: x, y: y, w: sz, h: sz, bg: 'random', fg: 'contrast' }, init: true, refresh: true, draw: draw_dom };

	game_add_item(item);

}
function game_add_item(item) {
	addKeys({ init: true, refresh: true, draw: draw_dom }, item);
	G.items.push(item);
}
function get_center(d) { let r = getRect(d); return [r.w / 2, r.h / 2]; }
function iInit(dParent, item) {
	if (is_canvas(dParent)) draw_on_canvas(dParent.cx, item);
	else draw_on_div(dParent, item);
}
function is_canvas(item) { return isdef(item.cx) && isdef(item.cv); }
function load_all() {
	dTable.innerHTML = '';
	Items = [];
	let list = fromLocalStorage();
	for (const l of list) {
		iAdd(l, { div: mDiv(dTable, l.styles, l.id) });
	}
}
function serialize_all() {
	let list = [];
	for (const id in Items) {
		let res = default_item_serializer(Items[id]);
		list.push(res);
	}
	console.log('list', list)
	downloadAsYaml(list, '_all');
	toLocalStorage(list);
}
function show_available_voices() { say('', 'english male', () => console.log(DA.voicelist.map(x => x.name))); }
function ui_type_item_line(dParent, item, styles = {}, handler = null, props = []) {
	//addKeys({ align: 'center', overflow: 'hidden', cursor: 'pointer', rounding: 10, margin: 10, padding: 5, w: 120, wmin: 90, display: 'inline-block', bg: 'random', fg: 'contrast' }, styles);
	let d = mDiv(dParent, styles, `d_${item.key}`); mFlex(d);
	for (const p of props) {
		let family = p == 'text' ? item.family : 'arial';
		let fz = p == 'text' ? 40 : 20;
		//console.log('content',item[p])
		mDiv(d, { family: family, fz: fz, bg: styles.bg, fg: styles.fg }, null, item[p]);
	}
	if (isdef(handler)) {d.onclick = handler; d.setAttribute('item',JSON.stringify(item));}
	return d;
}
function ui_type_item(dParent, item, styles = {}, handler = null, show_key = null) {
	addKeys({ align: 'center', overflow: 'hidden', cursor: 'pointer', rounding: 10, margin: 10, padding: 5, w: 120, wmin: 90, display: 'inline-block', bg: 'random', fg: 'contrast' }, styles);

	let d = mDiv(dParent, styles);
	if (!isEmptyOrWhiteSpace(item.text)) mSpan(d, { family: item.family, fz: 50 }, item.text);
	if (show_key) {
		mSpan(d, { family: 'opensans' }, '<br>' + show_key);
		// mSpan(d, { family: 'opensans' }, `key:${item.key}`);
		// if (isdef(item.E)) mSpan(d, { family: 'opensans' }, `<br>E:${item.E}`);
		// if (isdef(item.D)) mSpan(d, { family: 'opensans' }, `<br>D:${item.D}`);
	}

	if (isdef(handler)) d.onclick = handler;

	return d;
}


//unused
function draw_dom(item) {
	if (item.init) { item.init = false; iAdd(item, { div: mDiv(valf(dParent, item.container, dTable)) }); }
	if (item.refresh) { item.refresh = false; mStyle(iDiv(item.id), item.styles); }
}
function draw_canvas(item) {
	//was soll das machen? wie weiss ich welcher canvas???
	//was ist wenn es keinen canvas gibt? soll ich dann assumen die table ist ein canvas???
	//soll es einen default canvas geben auf der table? oder soll die table ein canvas sein?!?!?

	let r = getRect(dTable);
	let c = mCanvas(d, { w: r.w, h: r.h, rounding: 0, bg: 'white' }); let [cv, cx] = [c.cv, c.cx];

	for (const item of items) {
		let d1 = item.div = cRect(item.x, item.y, item.w, item.h, { bg: item.bg }, cx); //cEllipse(x,y,styles.w,styles.h,styles,0,cx);
	}
}
function drawloop() { G.items.map(x => { if (isdef(x.draw)) x.draw(x); }); }
function mDivCenteredAt(pt, dParent, styles = {}, id, inner, classes) {
	//add a default size if none:
	[w, h] = detect_size_from_styles(styles);
	addKeys({ position: 'relative' }, dParent);
	copyKeys({ position: 'absolute', x: w / 2, y: h / 2 }, styles);
	return mDiv(dParent, styles, id, inner, classes);
}
function start_loop() {
	TO.running = setInterval(() => {
		for (const item of G.items) {

		}
	}, 100);
}




















