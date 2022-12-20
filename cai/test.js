
function test21_resizable() {

}
function test22_centering_container() {
	let d = mDiv(dTable, { bg: 'yellow', w: '100%', h: '100%', aitems: 'center' }); mCenterCenter(d);//, { display: 'grid', place: 'center', h: '100%', w:'100%' });//parent
	//let d1 = mDiv(d, { bg:'red', 'place-content':'center',w:'80%',display: 'grid', 'grid-template-columns': 'repeat(auto-fill, 100px)','grid-gap':'1rem'});
	//mCenter(d,4);
	for (let i = 0; i < 14; i++) {
		mDiv(d, { display: 'inline-block', w: rNumber(50, 150), h: rNumber(50, 150), bg: 'random', margin: 10 });
	}
}
function test21_centering_container() {
	let d = mDiv(dTable, { bg: 'yellow', w: '100%', h: '100%' }); mCenterCenter(d);//, { display: 'grid', place: 'center', h: '100%', w:'100%' });//parent
	let d1 = mDiv(d, { bg: 'red', 'place-content': 'center', w: '80%', display: 'grid', 'grid-template-columns': 'repeat(auto-fill, 100px)', 'grid-gap': '1rem' });
	//mCenter(d,4);
	for (let i = 0; i < 14; i++) {
		mDiv(d1, { w: rNumber(50, 150), h: 100, bg: 'random', margin: 10 });
	}
}

function test20_aspect_ratio_image_card() {
	let d = mDiv(dTable, { display: 'grid', place: 'center', h: '100%' });//parent

	let dcard = mDiv(d, { w: '50%', display: 'flex', dir: 'column', padding: '1rem' }, null, null, 'blue'); //card

	let dtitle = mTag('h1', 'Video Title', dcard);
	let dimg = mDiv(dcard, { aspectRatio: '16 / 9' }, null, null, 'green'); //visual
	let ddesc = mTag('p', 'Descriptive Text goes here', dcard);

	return d;
}

//#region FAILED
async function fail_yt() {

	let url = `http://gdata.youtube.com/feeds/api/videos`; //blocked by CORS
	let result = await route_path_text(url);
	console.log('result', result);

	let res = `
		http://gdata.youtube.com/feeds/api/videos
		?v=2
		&author=SesameStreet
		&q=rubber+ducky
		&orderby=viewCount
		&start-index=1
		&max-results=10
		&alt=json-in-script
		&callback=myCallbackFunction
		&prettyprint=true
	`;

}
//#endregion

//#region misc tests
function test17_load_save_texte() {
	mStyle(dTable, { h: '100%', family: 'opensans', fz: 20, bg: ORANGE, fg: 'white', position: 'relative' }); mCenterFlex(dTable);
	//return;
	//mStyle(dTable, { overflow:'auto',position: 'relative', w: '100%', family: 'opensans', fz: 20, bg: ORANGE, fg: 'white' });//mStyle(dTable, { w: '100%', overflow: 'hidden', fz: 22 }); mCenterFlex(dTable);
	// #region tests
	//show_available_voices();
	//test15_qa();//test16_yt(); //test13_load_yt_in_iframe(); //test15_qa(); //test12_iconviewer(); //	test11_say();
	// #endregion tests

	//console.log('hallo');	test7_uploadfile();
	let buttons = ['clear', 'magic']; //,'lineup','orig'];
	dToolbar = mToolbar(buttons, onclick_toobar, 'dToolbar', { padding: 10, display: 'flex', gap: 10, bg: 'orange' });

	document.addEventListener('mouseleave', e => { console.log('page mouse left!!!'); save_all(); })
	document.addEventListener('visibilitychange', e => { if (document.visibilityState === 'visible') { console.log('page activated!'); } else { console.log('page deactivated!!!'); save_all(); } });

	load_all();
	//onkeyup=_cycle_through_editables;


	onclick = open_invisible_input;



}
//#region test17
DA.edits = [];
function add_edit(x, y, text = '', bg = 'random') {
	let d = mDiv(dTable, { bg: bg, fg: 'contrast', x: x, y: y, position: 'absolute', padding: 10, wmin: 10, }, getUID(), text); //,'<span contenteditable="true">This is an editable paragraph.</span>');
	DA.edits.push(d);
	add_interaction(d);
}
function add_interaction(d) {
	d.setAttribute('contentEditable', true);
	d.style.outline = 'none';
	d.onkeydown = function (e) {
		DA.tabKeyPressed = e.keyCode == 9;
		if (DA.tabKeyPressed) {
			e.preventDefault();
			return;
		} else {
			//console.log('keyCode',e.keyCode);
			//if (e.keyCode == 13){			save_all();			}
		}
	};
	d.onkeyup = function (e) {
		if (DA.tabKeyPressed) {
			//console.log('TAB!', DA.edits); // Do stuff for TAB
			//what is the index of this div?
			let idx = DA.edits.indexOf(e.target);
			//console.log('i am index',idx);
			let next = (idx + 1) % DA.edits.length;
			if (next != idx) DA.edits[next].focus();
			e.preventDefault();
			return;
		}


		//Do other stuff when not TAB
	};
	d.onfocus = e => {

		//console.log('target',e.target.id);
		//return;
		if (DA.focusElement != e.target && isdef(DA.focusElement)) {
			let el = DA.focusElement;
			if (isEmpty(el.innerHTML)) {
				removeInPlace(DA.edits, el);
				el.remove();
				//console.log('recycled:',el);
			}
		}

		//console.log('target',e.target);
		//let id = evToId(e); console.log('id', id); let elem = mBy(id); selectText(elem);

		//console.log('focus');
		DA.focusElement = e.target;
		//if (DA.selectOnClick) selectText(DA.focusElement);

		//if (isEmpty(d.innerHTML)) {removeInPlace(DA.edits,d);d.remove(); }
	};
	d.focus();
}
async function load_all() {
	let o = await route_path_yaml_dict('../y/page.yaml');
	for (const item of o) { add_edit(item.x, item.y - 41, item.text); }
}
function onclick_toobar(name) {
	console.log('clicked', name);
	switch (name) {
		case 'clear': mClear(dTable); DA.edits = []; break;
		case 'magic': break;
		case 'lineup':
			mCenterFlex(dTable); //mStyle(dTable,{display:'grid'});
			DA.edits.map(x => mStyle(x, { position: null, display: 'inline' }));
			break;
		case 'orig': DA.edits.map(x => x.style.position = 'absolute'); break;
	}
}
function open_invisible_input(ev) {
	if (ev.target.id != 'dTable') return;
	let [x, y] = [ev.offsetX, ev.offsetY];
	y = toModulo(y - 10, 20, 0, mStyleGet(dTable, 'h') - 47);
	x = toModulo(x, 50);
	add_edit(x, y);
}
function save_all() {
	//console.log('save',Date.now())
	let data = [];
	for (const edit of DA.edits) {
		let rect = getRect(edit);
		let text = edit.innerHTML;
		let o = { x: rect.x, y: rect.y, text: text };
		data.push(o);
	}
	route_post_json('http://localhost:3000/post/json', { data: data, filename: 'page' }, response => {
		//console.log(JSON.stringify(response));
	});
}

//#endregion


function test16_yt() {
	playt();
}
function test15_qa() {
	G = {
		i: 0,
		q: null, //current question object
		alist: null, // current answers list
		selist: null, //current answers selected
		hist: [], // tuples [{i,q,as,selist} ...]
		stcont: { box: true, wmin: 600 },
		sta: { cursor: 'pointer', aitems: 'center', vpadding: 6, hpadding: 12, gap: 4, margin: 6, rounding: 12, fg: 'contrast' },
		stq: { padding: 12, weight: 'bold', family: 'opensans', fz: 28 },
	};
	q0();
}

function test14() {
	show_emos();
	say('what do you feel right now???', 'uk', null, .5, .8);
}

function question2(ev) {
	//console.log('target',ev.target)
	let id = evToId(ev);
	let item = Items[id];

	// ev.stopPropagation();
	// let d=ev.target;
	// let item = JSON.parse(d.getAttribute('item'));
	console.log('item', item);
	say(`why do you feel ${item.list}???`, 'uk', show_reasons, .5, .8);

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

	dTable = mBy('dTable');
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
	mBy('dTable').innerHTML = `
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
	let o = { filename: 'ex', data: { text: 'jajajaaber geh jaaaa', id: 78912 } };

	route_post_json('http://localhost:3000/post/json', o, response => {
		console.log(JSON.stringify(response))
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
	dTable = mDiv('dTable');
	load_all();
}
function test4_save() {
	let [table, players] = test3_sit_around_table(3); //tests1_canvas_vs_dom(); //tests0_table_drawloop();function mStyle
	serialize_all();
}
function test3_sit_around_table(n = 4) {
	dTable = mBy('dTable');
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
	dTable = mBy('dTable');
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
	let dPage = mBy('dTable'); mCenterCenterFlex(dPage); mStyle(dPage, { gap: 4 }); // mStyle(dPage, { padding:10, bg: BLUE, align: 'center' });
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
	dTable = mBy('dTable'); mStyle(dTable, { vpadding: 20, bg: BLUE, align: 'center' });
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

//#endregion











