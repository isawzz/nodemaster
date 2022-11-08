onload = start; TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}
	await load_syms();

	test13_load_yt_in_iframe(); //test11_say();

}
function mSpan(dParent, styles, innerHTML) {
	let d = mCreate('span');
	if (isdef(styles)) mStyle(d, styles);
	if (isdef(innerHTML)) d.innerHTML = innerHTML;
	if (isdef(dParent)) mAppend(dParent, d);
	return d;
}
function ui_type_item(dParent, item, styles = {}, handler = null, show_key = false) {
	addKeys({ align: 'center', overflow: 'hidden', cursor: 'pointer', rounding: 10, margin: 10, padding: 5, w: 120, wmin: 90, display: 'inline-block', bg: 'random', fg: 'contrast' }, styles);

	let d = mDiv(dParent, styles);
	if (!isEmptyOrWhiteSpace(item.text)) mSpan(d, { family: item.family, fz: 50 }, item.text);
	if (show_key) {
		mSpan(d, { family: 'opensans' }, `key:${item.key}`);
		if (isdef(item.E)) mSpan(d, { family: 'opensans' }, `<br>E:${item.E}`);
		if (isdef(item.D)) mSpan(d, { family: 'opensans' }, `<br>D:${item.D}`);
	}

	if (isdef(handler)) d.onclick = handler;

	return d;
}

function test7_uploadfile() {
	let o = { filename: 'ex', data: { text: 'aber geh jaaaa', id: 78912 } };

	route_post_json('http://localhost:3000/post/json', o, r => {
		dTable.children[0].innerHTML = r.checked;
		console.log(JSON.stringify(r))
	});
}

function test6_init() {

	let item = { styles: { bg: 'orange', w: 30, h: 30, round: true } };

	iInit(c1, item);
	iInit(c2, item);
	iInit(dTable, item);

	start_loop();

	//jetzt soll sich irgendwas an dem item aendern! zB die color
	setTimeout(() => item.styles.bg = BLUE, 2000);

}





















