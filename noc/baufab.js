
function walker_create() {
	let o = { x: CV.width / 2, y: CV.height / 2, color: 'red', type: 'walker' };
	console.log('created', o);
	return o;
}
function walker_draw(o) {
	CX.fillStyle = o.color;
	cEllipse(CX, o.x, o.y, 25, 25);
}
function walker_update(o) {
	//heisst speed 1
	o.x += Math.random() * 2 - 1;
	o.y += Math.random() * 2 - 1;
}









function ui_type_canvas(dParent, handle_play, handle_pause, styles = {}, bstyles = {}) {

	addKeys({ w: 500, h: 500, bg: '#222', rounding: 10 }, styles);
	let [cv, cx] = mCanvas(dParent, styles); 

	if (nundef(handle_play)) return { cv: cv, cx: cx };

	addKeys({ fz: 28, fg: 'lightgreen', display: 'flex', ajcenter: true, w: styles.w }, bstyles)
	let controls = mPlayPause(dParent, bstyles, handle_play, handle_pause);

	return { cv: cv, cx: cx, div: controls.button, play: controls.play, pause: controls.pause };
}









