onload = start; TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}
	//show_available_voices();
	await load_syms();
	dTable = mBy('map'); mStyle(dTable, { w: '100%', overflow: 'hidden', fz: 22 }); mCenterFlex(dTable);
	test15_qa(); //test12_iconviewer(); //	test13_load_yt_in_iframe(); //test11_say();

}
function test15_qa() {
	G = {
		i: 0,
		q: [],
		as: [],
		a: null,
		hist: [],
		stcont: { box: true, wmin: 600 },
		sta: { cursor: 'pointer', aitems: 'center', vpadding: 6, hpadding: 12, gap: 4, margin: 6, rounding: 12, fg: 'contrast' },
		stq: { padding: 12, weight: 'bold', family: 'opensans', fz: 28 },
	};
	q1();
}
function q1() {
	let list0 = dict2list(EMO.emoscale, 'k'); console.log('list', list0)
	let list = dict2list(EMO.emoscale, 'k').map(x => ({ name: x.k, key: x.key, color: x.color, text: x.list })); //console.log('list', list)
	prompt('what are you feeling right now?', list, q2);

}
function q2(ev) { 
	let id = evToId(ev); console.log('selected', id); 

}
function prompt(q, list, handler) {
	let dqcont = mDiv(dTable, G.stcont);
	let dq = mDiv(dqcont, G.stq, `q_${G.i}`, q);
	let qitem = iAdd({type:'q',index:G.i,text:q},{cont:dqcont,div:dq});
	let dacont = mDiv(dTable, G.stcont);
	let aslist = [];
	list.map(x => {
		//console.log('color',x.color)
		let da = ui_type_sym_text_line(dacont, x, dict_augment({ bg: x.color, fg: 'contrast' },G.sta), handler, ['text', 'list']); // emo.list.split(',').join('<br>')); //,{bg:emo.color,padding:10})
		let item = iAdd(x, { div: da });
		console.log('item',item)
		aslist.push(item.id);
	});
	G.q.push(qitem.id);
	G.as.push(aslist);
	G.i++;
}
function iStrip(item){ }
function ui_type_sym_text_line(dParent, item, styles = {}, handler = null) {
	//item must have a sym (or a key w/ exists Syms[key]) and a text
	//console.log('styles',styles)
	let d = mDiv(dParent, styles, `d_${item.key}`); mFlex(d);
	let sym = valf(item.sym, Syms[item.key]);
	mDiv(d, { family: sym.family, fz: 40 }, null, sym.text);
	//mDiv(d, dict_augment(styles, { family: 'opensans', fz: 20, fg: 'contrast' }), null, item.text);
	mDiv(d, { family: 'opensans', fz: 20 }, null, item.text);
	if (isdef(handler)) { d.onclick = handler; d.setAttribute('item', JSON.stringify(item)); }
	return d;
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




















