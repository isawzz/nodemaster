onload = start; TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}
	//show_available_voices();
	//await load_syms();
	//dTable = mBy('map'); mStyle(dTable, { w: '100%', overflow: 'hidden', fz: 22 }); mCenterFlex(dTable);
	//test16_yt(); //test13_load_yt_in_iframe(); //test15_qa(); //test12_iconviewer(); //	test11_say();

}
function test16_yt(){
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
function q0() {
	//let list0 = dict2list(EMO.emoscale, 'k'); //console.log('list', list0)
	let list = dict2list(EMO.emoscale, 'k').map(x => ({ name: x.k, key: x.key, color: x.color, text: x.list })); //console.log('list', list)
	show_prompt('how are you feeling right now?', list, a0);

}
function a0(ev) {
	//assertion(G.selist.length>0,'NOTHING SELECTED IN a0!!!')
	toggle_select(evToItem(ev), G.selist);
	toolbar_check();
}
function q1() {
	let list = [];

	for (const item of G.selist) {
		//console.log('item',item)
		let alpha = .4;
		for (const w of item.text.split(',')) {
			let o = { name: w.trim(), key: item.key, color: colorTrans(item.color, alpha), text: w.trim() };
			alpha += .2;
			list.push(o);
		}
	}

	show_prompt('select the 2 dominant feelings', list, a1);

}
function a1(ev) { a0(ev); }
function q2() {
	//assume worried

	//steps: 1. vor auge fuehren, starte music
	const transitions = {
		worried: {
			money: {},
			time: {},
			past: {},
			future: {},
			material: {},
		},
	};
	let step1=''
	//close your eyes
}














function handle_command(cmd) {
	//console.log('handle command', cmd);
	switch (cmd) {
		case 'clear': G.selist = clear_select(G.selist); toolbar_check(); break;
		case 'next': push_hist(); inc_g_index(); break;
		case 'back': pop_hist(); dec_g_index(); break;
		default: console.log('do not know how to handle ***', cmd, '***'); break;
	}
	//let func = get_func(itemtype, cmd);	func();
}
function show_prompt(q, list, handler) {
	mClear(dTable);
	console.log('list', list)
	let dqcont = mDiv(dTable, G.stcont);
	mLinebreak(dTable);
	let dq = mDiv(dqcont, G.stq, `q_${G.i}`, q);

	let qitem = iAdd({ type: 'q', index: G.i, text: q }, { cont: dqcont, div: dq });
	let dacont = mDiv(dTable, G.stcont);

	mLinebreak(dTable);
	let tb = mToolbar(['back', 'clear', 'next'], handle_command, dTable, { align: 'center' }, { margin: 8, fz: 30, cursor: 'pointer' });
	G.buttons = tb.children;

	let aslist = [];
	list.map(x => {
		//console.log('color',x.color)

		//depending on list elements, use different ui_types: 
		//1. if {key: sym: text: color:} use ui_type_sym_text_line
		let da = ui_type_sym_text_line(dacont, x, dict_augment({ bg: x.color }, G.sta), handler);

		//2. if multiselect - kann ich das ueber den handler abdecken??? sollte ja

		let item = iAdd(x, { div: da });
		//console.log('item',item)
		aslist.push(item.id);
	});
	G.q = qitem.id;
	G.alist = aslist;
	G.selist = [];
	//dTable['transition-style']="in:wipe:up";
	dTable.setAttribute('transition-style', "in:wipe:bottom-right");
	toolbar_check();
}





















function show_emos() {
	let d = mDiv(dTable, DA.styles); //{ box: true, padding: 20, wmin:600 });
	//console.log('!!!', EMO);
	for (const k in EMO.emoscale) {
		let emo = EMO.emoscale[k];
		//old code
		//let item = Syms[emo.key];
		//ui_type_item(dTable, item, { bg: emo.color }, null, emo.list.split(',').join('<br>')); //,{bg:emo.color,padding:10})

		//new code
		let sym = Syms[emo.key];
		let item = { name: k, key: emo.key, text: sym.text, color: emo.color, family: sym.family, list: emo.list };
		//mDiv(dTable, { bg:'red', family: family, fz:fz }, item[p]);	break;
		//console.log('item',item)
		let handler = question2; // ev => { evNoBubble(ev); question2(ev) };
		let d1 = ui_type_item_line(d, item, { cursor: 'pointer', aitems: 'center', vpadding: 6, hpadding: 12, gap: 4, margin: 6, rounding: 12, bg: item.color, fg: 'contrast' }, handler, ['text', 'list']); // emo.list.split(',').join('<br>')); //,{bg:emo.color,padding:10})

		iAdd(item, { div: d1 });
		//mLinebreak(d)
	}
	//mFall(d); //mAppear(d,2500)
}




















