class TransformationMatrix {
	constructor() { this.reset(); }
	reset() {
		this.m = [1, 0, 0, 1, 0, 0];
		this.angle = 0;

	}
	multiply(mat) {
		let m = this.m;
		var m0 = m[0] * mat[0] + m[2] * mat[1];
		var m1 = m[1] * mat[0] + m[3] * mat[1];
		var m2 = m[0] * mat[2] + m[2] * mat[3];
		var m3 = m[1] * mat[2] + m[3] * mat[3];
		var m4 = m[0] * mat[4] + m[2] * mat[5] + m[4];
		var m5 = m[1] * mat[4] + m[3] * mat[5] + m[5];
		this.m = [m0, m1, m2, m3, m4, m5];
	}
	screenPoint(transformedX, transformedY) {
		// invert
		let m = this.m;
		var d = 1 / (m[0] * m[3] - m[1] * m[2]);
		im = [m[3] * d, -m[1] * d, -m[2] * d, m[0] * d, d * (m[2] * m[5] - m[3] * m[4]), d * (m[1] * m[4] - m[0] * m[5])];
		// point
		return {
			x: transformedX * im[0] + transformedY * im[2] + im[4],
			y: transformedX * im[1] + transformedY * im[3] + im[5],
		};
	}
	transformedPoint(screenX, screenY) {
		let m = this.m;
		return {
			x: screenX * m[0] + screenY * m[2] + m[4],
			y: screenX * m[1] + screenY * m[3] + m[5],
		};
	}
	translate(x, y) {
		var mat = [1, 0, 0, 1, x, y];
		this.multiply(mat);
	}
	rotate(rAngle) {
		var c = Math.cos(rAngle);
		var s = Math.sin(rAngle);
		var mat = [c, s, -s, c, 0, 0];
		this.angle += rAngle;
		this.multiply(mat);
	}
	scale(x, y) {
		var mat = [x, 0, 0, y, 0, 0];
		this.multiply(mat);
	}
	skew(radianX, radianY) {
		var mat = [1, Math.tan(radianY), Math.tan(radianX), 1, 0, 0];
		this.multiply(mat);
	}
	setContextTransform(ctx) {
		let m = this.m;
		ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
	}
	resetContextTransform(ctx) {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.angle = 0;
	};
	getTransformedPoint(screenX, screenY) {
		return this.transformedPoint(screenX, screenY);
	}
	getScreenPoint(transformedX, transformedY) {
		return this.screenPoint(transformedX, transformedY);
	};
	getMatrix() {
		let m = this.m;
		var clone = [m[0], m[1], m[2], m[3], m[4], m[5]];
		return clone;
	}
}
