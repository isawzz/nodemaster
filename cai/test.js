


function test14() {
	show_emos();
	say('what do you feel right now???','uk',null,.5,.8);
}

function question2(ev){
	//console.log('target',ev.target)
	let id = evToId(ev);
	let item = Items[id];

	// ev.stopPropagation();
	// let d=ev.target;
	// let item = JSON.parse(d.getAttribute('item'));
	console.log('item',item);
	say(`why do you feel ${item.list}???`,'uk',show_reasons,.5,.8);

	// let d1=d.lastChild;
	// let list = d1.innerHTML;
	// console.log('list',d,d.id); //,d1,list);

}

function test13_load_yt_in_iframe() {

	var div = document.createElement('iframe');
	div.id = 'iframe1';
	mStyle(div, { w: 500, h: 300 })
	document.getElementById("map").appendChild(div);
	div.src = "https://www.youtube.com/embed/3pNpHZ1yv3I"; //YES!
	//setTimeout(()=>simulateClick(div),1000);
	//trigger click event on source

	//iDiv.src = "https://www.youtube.com/embed/3pNpHZ1yv3I?autoplay=1";

}
async function test12_iconviewer() {

	//let x=12+13, y='13';console.log(Number(y),x.toFixed(3), Number('12').toFixed(2)); return; //4.toFixed(2) geht NICHT!!!
	//test4_save();	test5_load();	test7_uploadfile();

	//Speech = new SpeechAPI('D');

	//console.log('SymKeys', SymKeys);
	let items = findKeys('face').map(x => Syms[x]); // filter keys
	items = KeySets['smileys-emotion'].map(x => Syms[x]);
	items = items.map(x => ({ key: x.key, text: x.text, E: x.E, D: x.D, family: x.family }));
	let items2 = Info.emotion.map(x => ({ key: x, E: x, D: '', family: 'opensans', text: '' }));
	sortBy(items2, 'key');
	items2 = arrRemoveDuplicates(items2, 'E');
	//console.log('items', items2[0])
	items = items.concat(items2);

	dTable = mBy('map');
	for (const item of items) ui_type_item(dTable, item, {}, null, item.key);
	//dTable.innerHTML = createViewerContent(items, [], true);
}
async function test11_say() {
	say(germanize('wie fuehlst du dich gerade?'), 'pl', test12_iconviewer, 1, .8, .8);
}
function test10_autocomplete() {
	let map = M.map = create_map({ zoom: 16 });
	map.on('moveend', function (e) { calc_map_dims(); console.log("dims", M.dims); });

	let tb = M.toolbar = create_toolbar(map);
	mButton('Dummy', dummy_reaction, tb);
	mAutocomplete(tb);

	// let city = rChoose(M.capitals);
	// console.log('city has been chosen:', city);

	// map.flyTo(Geo.cities[city].center);
}
function test9_google() {
	mBy('map').innerHTML = `
	<iframe class='flat' id="gmap" src="http://maps.google.com/maps?z=15&t=m&q=loc:48.25+16.3&output=embed" width="100%" height="${window.innerWidth}"></iframe>	
	`;
	let x = document.getElementById('gmap');
	console.log('x', x);
	mStyle(x, { bg: 'blue' });

}
function test8_load_googlemap_in_iframe() {

	var iDiv = document.createElement('iframe');
	iDiv.id = 'iframe1';
	mStyle(iDiv, { w: '100%', h: '100%' })
	document.getElementById("map").appendChild(iDiv);
	iDiv.src = 'https://maps.google.com/maps?q=48.2,16.3&output=embed';
	// iDiv.src = 'https://maps.google.com/maps?q=48.2,16.3&hl=fa;z=5&ie=UTF8&output=embed&hl=en';
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
function test5_load() {
	dTable = mDiv('map');
	load_all();
}
function test4_save() {
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
	let styles = { round: true, x: pTable.x, y: pTable.y, position: 'absolute', w: szTable, h: szTable, classname: 'wood' };
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



















