
class CItemWalker {
	constructor(name, options = {}) {
		options.label = name;
		addKeys({ x: 0, y: 0, color: rColor(60) }, options);
		if (isdef(options.sz)) options.w = options.h = options.sz;
		addKeys(options, this);
	}
	update() { move_random(this, this.canvas); }
	draw() { draw_label(this.canvas,this); }
}























