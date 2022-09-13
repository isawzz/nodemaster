function ui_type_canvas(dParent, handle_play, handle_pause, styles = {}, bstyles = {}) {

	addKeys({ w: 500, h: 500, bg: '#222', rounding: 10 }, styles);
	[cv, cx] = mCanvas(dParent, styles); //by convenience, cv and cx are globals!!!!!

	if (nundef(handle_play)) return { cv: cv, cx: cx };

	addKeys({ fz: 28, fg: 'lightgreen', display: 'flex', ajcenter: true, w:styles.w }, bstyles)
	let controls = mPlayPause(dParent, bstyles, handle_play, handle_pause);

	return { cv: cv, cx: cx, button: controls.button, play: controls.play, pause: controls.pause };
}









