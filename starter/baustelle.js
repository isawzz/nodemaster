
function create_flower(){

}
function flower_draw(x, y, color, angle = 0, petalCount = 1, lineWidth = 3, sz = 10) { 
	function createPetal(length, width) {
		const path = new Path2D();
		path.moveTo(0, 0); // draw outer line
		path.lineTo(length * 0.3, -width);
		path.lineTo(length * 0.8, -width);
		path.lineTo(length, 0);
		path.lineTo(length * 0.8, width);
		path.lineTo(length * 0.3, width);
		path.closePath(); // close the path so that it goes back to start

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
		CX.setTransform(1, 0, 0, 1, x, y); // set center
		CX.rotate(startAt);  // set start angle
		for (var i = 0; i < count; i += 1) {
			CX.stroke(petal);  // draw a petal
			CX.rotate(step);   // rotate to the next
		}
		CX.setTransform(1, 0, 0, 1, 0, 0);  // restore default
	}
	CX.strokeStyle = color;
	CX.lineWidth = lineWidth;
	const size = 50;// Math.min(cx.canvas.width, cx.canvas.height) * fitScale * 0.5;
	drawPetals(x, y, petalCount, angle, createPetal(sz, sz * .2)); //cx.canvas.width / 2, cx.canvas.height / 2, 5, 0, createPetal(size, size * 0.2));
	CX.beginPath();
	CX.arc(x, y, sz * .15, 0, Math.PI * 2); //cx.canvas.width / 2, cx.canvas.height / 2, size * 0.15, 0, Math.PI * 2);
	CX.fillStyle = color;
	CX.fill();
}











