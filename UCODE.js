






function drawLeaf(ctx, x, y) {
	ctx.beginPath();
	//ctx.rotate(-angle) geht ueberhaupt nicht!!!
	// ctx.arc(200, 150, 50, 0, 0.5 * Math.PI);
	// ctx.arc(250, 200, 50, Math.PI, 1.5 * Math.PI);
	let sz = Math.random() * 10 + 10; //50
	ctx.arc(x, y, sz, 0, 0.5 * Math.PI);
	ctx.arc(x + sz, y + sz, sz, Math.PI, 1.5 * Math.PI);
	//ctx.fillStyle = ("#0f3")
	ctx.fill();
	ctx.stroke()
	ctx.closePath();

}

function cEllipse(cx, x, y, w, h, angle) {
	cx.save(); // save state
	cx.beginPath();

	//cx.translate(x - rx, y - ry);
	//cx.translate(x,y);
	//cx.scale(1, h/w);  //
	//cx.rotate(angle);
	cx.arc(x, y, w, 0, 2 * Math.PI, false);

	cx.restore(); // restore to original state
	cx.stroke();
	cx.fill();
}
function cEllipse(cx, x, y, rx, ry, angle) {
	cx.save(); // save state
	cx.beginPath();

	//cx.translate(x - rx, y - ry);
	cx.translate(x,y);
	cx.scale(rx, ry);
	cx.rotate(angle);
	cx.arc(1, 1, 1, 0, 2 * Math.PI, false);

	cx.restore(); // restore to original state
	cx.stroke();
	cx.fill();
}
function add_fork(b) {
	let pt = b.p[1];
	//let a1 = b.angle + toRadian(25);
	let len = b.len * .67;
	let thickness = b.thickness * .75;
	//let color = colorLight(b.color, .1*
	b.done = true;

	add_branch(pt,b.angle + toRadian(25),len,thickness,color,b.age+1);
	add_branch(pt,b.angle - toRadian(25),len,thickness,b.age+1);
}
