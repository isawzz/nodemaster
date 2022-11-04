



function test5_load(){
	dTable = mDiv('map');
	load_all();
}
function test4_save(){
	let [table, players] = test3_sit_around_table(3); //tests1_canvas_vs_dom(); //tests0_table_drawloop();function mStyle
	serialize_all();
}
function test3_sit_around_table(n = 4) {
	dTable = mBy('map');
	let r = getRect(dTable);
	let [w, h] = [r.w * .9, r.h * .9]; // [r.w,r.h]
	let [offx, offy] = [r.w * .05, r.h * .05]; //[0,0];
	let mindim = Math.min(w, h);
	let [szTable, szPlayer] = [mindim / 2, mindim / 4];
	let pTable = { x: offx + w / 2 - szTable / 2, y: offy + h / 2 - szTable / 2 };
	let styles = { round: true, x: pTable.x, y: pTable.y, position: 'absolute', w: szTable, h: szTable, classname:'wood' };
	let d = mDiv(dTable, styles); //, null, null, 'wood');
	let table = iAdd({ numplayers: n, styles: styles }, { div: d })

	let numPlayers = n;
	let sz = szPlayer;
	let pts = cCircle({ x: offx + w / 2, y: offy + h / 2 }, w - sz, numPlayers);

	//let pts=cCircle({x:r.w/2,y:r.h/2}, 100, 4,0);
	//let pts = circleCenters(3,3,sz,sz)[0];
	console.log('pts', pts);

	let players = [];
	for (const pt of pts) {
		//make a div centered on pt
		let [x, y] = [pt.x - sz / 2, pt.y - sz / 2];
		//console.log('pt',pt,x,y);
		styles = { round: true, x: x, y: y, position: 'absolute', w: sz, h: sz, bg: colorFrom('randdark') };
		d = mDiv(dTable, styles);
		let player = iAdd({ styles: styles }, { div: d });
		players.push(player);
	}

	return [table, players];
}

function test2_sit_around_table() {
	dTable = mBy('map');
	let r = getRect(dTable);

	//let pts=cCircle({x:r.w/2,y:r.h/2}, 100, 4,0);
	let sz = 250;
	let pts = cCircle({ x: r.w / 2, y: r.h / 2 }, r.w - sz, 6, -90);
	for (const pt of pts) {
		//make a div centered on pt
		console.log('pt', pt)
		mDiv(dTable, { round: true, x: pt.x - sz / 2, y: pt.y - sz / 2, position: 'absolute', w: sz, h: sz, bg: 'randdark' });
	}

}
function tests1_canvas_vs_dom() {
	let dPage = mBy('map'); mCenterCenterFlex(dPage); mStyle(dPage, { gap: 4 }); // mStyle(dPage, { padding:10, bg: BLUE, align: 'center' });
	G = { items: [] };
	dHeader = mDivLine(dPage);
	mLinebreak(dPage);
	let st = { w: 300, h: 250, bg: 'randlight' };
	let c1 = new ccanvas(dPage, st); //mCanvas(dPage);
	mLinebreak(dPage);
	dTable = mDiv(dPage, st);
	mLinebreak(dPage);
	let c2 = new ccanvas(dPage, st); //mCanvas(dPage);
	mLinebreak(dPage);
	dFooter = mDivLine(dPage);
	mLinebreak(dPage);
}
function tests0_table_drawloop() {
	dTable = mBy('map'); mStyle(dTable, { vpadding: 20, bg: BLUE, align: 'center' });
	G = { items: [] };
	TO.running = setInterval(drawloop, 100);
	test1ttt(); //test0();
}

function test1ttt() {
	let board = new Board(dTable, 4, 4, ev => {
		let field = Items[ev.target.id];
		console.log('field', field);
		if (isdef(field.content)) return;
		let item = { field: field, container: ev.target, styles: { bg: 'red', w: 30, h: 30, rounding: '50%' } };
		game_add_item(item);

	}); //hex1Board(dTable);
	//console.log('board', board);
}
function test0() {
	//click on table soll create a random game object
	dTable.onclick = game_add_default_item;
}



















