class SimpleTransforms {
	constructor() {
		this.reset();
	}
	reset() {
		this.a = 0;
		this.sx = this.sy = 1;
		this.tx = this.ty = 0;
	}
	rotate(a) { this.a = (this.a + a) % 360; }
	scale(f) { this.sx += f; this.sy += f; }
	translate(x, y) { this.tx += x; this.ty += y; }
	get_matrix() {
		let m=[]
	}
}





















