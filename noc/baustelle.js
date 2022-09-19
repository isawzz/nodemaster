class TransformationMatrix {
	constructor() { this.reset_matrix(); }
	get_matrix() { let m = this.m; var clone = [m[0], m[1], m[2], m[3], m[4], m[5]]; return clone; }
	decompose(){return decompose_2d_matrix(this.m);}
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

	//modify current matrix:
	translate(x, y) { var mat = [1, 0, 0, 1, x, y]; this.multiply(mat); }
	rotate(rAngle) {
		var c = Math.cos(rAngle);
		var s = Math.sin(rAngle);
		var mat = [c, s, -s, c, 0, 0];
		this.angle += toDegree(rAngle);
		this.multiply(mat);
	}
	scale(x, y) { var mat = [x, 0, 0, y, 0, 0]; this.multiply(mat); }
	skew(radianX, radianY) { var mat = [1, Math.tan(radianY), Math.tan(radianX), 1, 0, 0]; this.multiply(mat); }
	reset_matrix() { this.m = [1, 0, 0, 1, 0, 0]; this.angle = 0; }
	reset_all() { this.reset_matrix(); this.reset_context(); }
	reset_context(ctx) { ctx.setTransform(1, 0, 0, 1, 0, 0); }
	sync(ctx) { let m = this.m; ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]); }

	//point transformation
	get_screenpoint(transformedX, transformedY) {
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
	get_transformedpoint(screenX, screenY) {
		let m = this.m;
		return {
			x: screenX * m[0] + screenY * m[2] + m[4],
			y: screenX * m[1] + screenY * m[3] + m[5],
		};
	}
}


function decompose_2d_matrix(mat) {
	var a = mat[0];
	var b = mat[1];
	var c = mat[2];
	var d = mat[3];
	var e = mat[4];
	var f = mat[5];

	var delta = a * d - b * c;

	let result = {
		translation: [e, f],
		rotation: 0,
		scale: [0, 0],
		skew: [0, 0],
	};

	// Apply the QR-like decomposition.
	if (a != 0 || b != 0) {
		var r = Math.sqrt(a * a + b * b);
		result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
		result.scale = [r, delta / r];
		result.skew = [Math.atan((a * c + b * d) / (r * r)), 0];
	} else if (c != 0 || d != 0) {
		var s = Math.sqrt(c * c + d * d);
		result.rotation =
			Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
		result.scale = [delta / s, s];
		result.skew = [0, Math.atan((a * c + b * d) / (s * s))];
	} else {
		// a = b = c = d = 0
	}

	return result;
}
