
//#region point
function plot_point(item, canvas) {
	let cx = canvas.cx;
	cx.font = `${valf(item.fz,16)}px Arial`;
	cx.fillStyle = item.color;
	if (isdef(item.label)) cx.fillText(`  ${item.label}`, 0, 0);
	cEllipse(0, 0, item.w, item.h, { bg: item.color }, 0, cx);
}
function plot_line(item, canvas) {
	let cx = canvas.cx;
	cx.font = `${valf(item.fz,16)}px Arial`;
	cx.fillStyle = item.color;
	if (isdef(item.label)) cx.fillText(`  ${item.label}`, 0, 0);
	cLine(item.x1,item.y1,item.x2,item.y2, { bg: item.color }, 0, cx);
}
function draw_point(item, canvas) {
	let cx = canvas.cx;
	cx.font = `${valf(item.fz,16)}px Arial`;
	cx.fillStyle = item.color;
	cx.fillText(`  ${item.x},${item.y}`, 0, 0);
	cEllipse(0, 0, 10, 10, { bg: item.color }, 0, cx);
}

//#region walker
function draw_walker(item, canvas) {
	let cx = canvas.cx;
	cx.translate(item.x, yreal);
	cx.rotate(toRadian(item.a));
	cRect(0 - item.w / 2, 0 - item.h / 2, item.w, item.h, { bg: item.color }, cx);
}
function update_randomwalker(item, canvas) {
	//random walker
	item.x += Math.random() * (coin() ? 1 : -1);
	item.y += Math.random() * (coin() ? 1 : -1);
	return true;
}

//#region car
function draw_car(item, canvas) {
	let cx = canvas.cx;
	//if (canvas.math) cx.scale(1,-1);
	cRect(0 - item.w / 2, 0 - item.h / 2, item.w, item.h, { bg: item.color }, cx);
	cRect(item.w - item.w / 2, 0 - item.h / 2, 10, item.h, { bg: 'yellow' }, cx);
}
function update_car(item, canvas) {
	let di = { ArrowUp: canvas.math ? 90 : 270, ArrowDown: canvas.math ? 270 : 90, ArrowLeft: 180, ArrowRight: 0 };
	// let di = { ArrowUp: 270, ArrowDown: 90, ArrowLeft: 180, ArrowRight: 0 };
	for (const key in di) {
		if (is_key_down(key)) {
			item.v.a = di[key];
			update_position(item);
			return true;
		}
	}
	return false;
}

//#region testing update
function movedown(item, canvas) {	item.y += 1; canvas.clamp(item); return true;}
function update_move(item, canvas) {
	//item.x += 1;
	item.y += 1; //Math.random() * (coin() ? 1 : -1);
	item.y = cycle(item.y,canvas.miny,canvas.maxy);
	return true;
}






















