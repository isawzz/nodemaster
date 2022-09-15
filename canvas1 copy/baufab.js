class CCanvas extends TransformationMatrix {
	constructor(dParent, styles, sz, unit) {
		super();
		//also wie mach ich einen canvas?
		let res = mCanvas(dParent, styles);
		[this.cv, this.cx] = [res.cv, res.cx];
		if (isdef(sz)) {
			this.cv.width = this.cv.height = sz; this.cx.translate(sz / 2, sz / 2);
			this.unit = unit;
		}

		this.items = [];
	}
	ellipse(x, y, w, h, styles = {}, angle = 0) {
		let ctx = this.cx;
		if (styles) this.style(styles, ctx);
		ctx.beginPath();
		ctx.ellipse(x, y, w / 2, h / 2, -angle, 0, 2 * Math.PI);
		if (isdef(styles.bg) || nundef(styles.fg)) ctx.fill();
		if (isdef(styles.fg)) ctx.stroke();
	}
	rect(x, y, w, h, styles) {
		let ctx = this.cx;
		if (styles) this.style(styles);
		if (isdef(styles.bg) || nundef(styles.fg)) ctx.fillRect(x, y, w, h);
		if (isdef(styles.fg)) ctx.strokeRect(x, y, w, h);
	}
	line(x1, y1, x2, y2, styles = {}) {
		let ctx = this.cx;
		if (styles) this.style(styles);
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2)
		ctx.stroke();
	}
	style(styles) {
		let ctx = this.cx;
		const di = { bg: 'fillStyle', fill: 'fillStyle', stroke: 'strokeStyle', fg: 'strokeStyle', thickness: 'lineWidth', cap: 'lineCap', ending: 'lineCap' };
		for (const k in styles) {
			ctx[isdef(di[k]) ? di[k] : k] = styles[k];
		}
	}

	rotateby(angle) {
		this.rotate(toRadian(angle));
		this.sync(this.cx);
	}
	scaleby(x, y) {
		if (nundef(y)) y = x;
		this.scale(x, y);
		this.sync(this.cx);
	}
	moveby(x, y) {
		this.translate(x, y);
		this.sync(this.cx);
	}
	rotateto(angle) {
		//only reset angle! keep translate and scale!

		this.rotate(toRadian(angle));
		this.sync(this.cx);
	}
	scaleto(x, y) {
		//only reset scale! keep translate and rotate!
		if (nundef(y)) y = x;
		this.scale(x, y);
		this.sync(this.cx);
	}
	moveto(x, y) {
		//only reset translate! keep rotate and scale!
		this.translate(x, y);
		this.sync(this.cx);
	}


	add(o) {
		this.items.push(new CanvasItem(o));
	}
	draw() {
		for (const item of this.items) {
			item.draw(this);
		}
	}

}
