class SimpleCanvas {
	constructor(dParent, styles, bstyles, play, pause, origin = 'cc') {
		//origin can be a point {x,y} or any of tl,tc,tr,cl,[cc],cr,bl,bc,br
		let o = mCanvas(dParent, styles, bstyles, play, pause);
		[this.cv, this.cx, this.play, this.pause] = [o.cv, o.cx, o.play, o.pause];
		let [w, h] = [this.w, this.h] = [this.cv.width, this.cv.height];
		this.defaultsize = 20;

		this.origin = this.init_origin(origin);
		this.cx.translate(this.origin.x, this.origin.y);

		this.maxx = w - this.origin.x; this.minx = this.maxx - w;
		this.maxy = h - this.origin.y; this.miny = this.maxy - h;

		//console.log('SimpleCanvas', this.minx, this.maxx, this.miny, this.maxy)
		this.items = [];
	}
	init_origin(origin) {
		if (nundef(origin)) origin = 'cc';
		let pt = origin;
		if (isString(origin)) {
			let v = origin[0], h = origin[1];
			let y = v == 't' ? 0 : v == 'c' ? this.cv.height / 2 : this.cv.height;
			let x = h == 'l' ? 0 : h == 'c' ? this.cv.width / 2 : this.cv.width;
			pt = { x: x, y: y };
		}
		return pt;

	}
	add(o = {}) {
		addKeys({ x: 0, y: 0, color: rColor(50), w: this.defaultsize, h: this.defaultsize, a: 0, draw: null }, o);
		this.items.push(o);
		return o;
	}
	update() {
		let n = 0;
		for (const item of this.items) { if (isdef(item.update)) { n += item.update(item, this) ? 1 : 0; } }
		//console.log('updated', n, 'items');
		return n > 0;
	}
	draw() {
		let cx = this.cx;
		cClear(this.cv, this.cx);
		for (const item of this.items) {
			this.draw_item(item);
			// cx.save();
			// cx.translate(item.x, item.y);
			// cx.rotate(toRadian(item.a));
			// if (isdef(item.draw)) { item.draw(item, this); }
			// else cEllipse(item.x, item.y, item.w, item.h, { bg: item.color }, 0, cx); //default draw
			// cx.restore();
		}
	}
	draw_item(item){
		let cx = this.cx;
		cx.save();
		cx.translate(item.x, item.y);
		cx.rotate(toRadian(item.a));
		if (isdef(item.draw)) { item.draw(item, this); }
		else cEllipse(item.x, item.y, item.w, item.h, { bg: item.color }, 0, cx); //default draw
		cx.restore();

	}
	clamp(item) { item.x = clamp(item.x, this.minx, this.maxx); item.y = clamp(item.y, this.miny, this.maxy) }
	cycle(item) { item.x = cycle(item.x, this.minx, this.maxx); item.y = cycle(item.y, this.miny, this.maxy) }
}
class Plotter extends SimpleCanvas {
	clear() {
		let ctx = this.cx;
		cClear(this.cv, ctx);
		ctx.beginPath();
		ctx.strokeStyle = "rgb(128,128,128)";
		ctx.moveTo(this.minx, 0); ctx.lineTo(this.maxx, 0);  // X axis
		ctx.moveTo(0, this.miny); ctx.lineTo(0, this.maxy);  // Y axis
		ctx.stroke();
	}
	draw() {
		this.clear();
		for (const item of this.items) {
			if (isdef(item.func)) this.plot(item.func, item.color, item.thickness);
			else {
				super.draw_item(item);
			}
		}
	}
	plot(func, color, thick) {
		let cx = this.cx;
		var xx, yy, dx = 4, x0 = 0, y0 = 0, scale = 40;
		var imax = Math.round(this.maxx / dx);
		var imin = Math.round(this.minx / dx);
		cx.beginPath();
		cx.lineWidth = thick;
		cx.strokeStyle = color;

		for (var i = imin; i <= imax; i++) {
			xx = dx * i; yy = scale * func(xx / scale);
			if (i == imin) cx.moveTo(x0 + xx, y0 - yy);
			else cx.lineTo(x0 + xx, y0 - yy);
		}
		cx.stroke();
	}
}







