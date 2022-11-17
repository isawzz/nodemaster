
function call_answer(i) { call_func('a' + i); }
function call_question(i) { call_func('q' + i); }
function call_func(name) { let f = window[name]; f(); }
function dec_g_index(i) { set_g_index(G.i - 1); }
function handle_command(cmd) {
	//console.log('handle command', cmd);
	switch (cmd) {
		case 'clear': G.selist = clear_select(G.selist); toolbar_check(); break;
		case 'next': push_hist(); inc_g_index(); break;
		case 'back': pop_hist(); dec_g_index(); break;
		default: console.log('do not know how to handle ***', cmd, '***'); break;
	}

	console.log('history', G.hist)
	console.log('current selection', G.selist.map(x => x.name));
	//let func = get_func(itemtype, cmd);	func();
}
function inc_g_index() { set_g_index(G.i + 1); }
function iStrip(item) { delete item.live; return item; }
function mDisable(elem) { elem = toElem(elem); mStyle(elem, { cursor: 'default', opacity: 0 }); }
function mEnable(elem) { elem = toElem(elem); mStyle(elem, { cursor: 'pointer', opacity: 1 }); }
function push_hist() { let o = { i: G.i, items: G.selist.map(x => iStrip(x)) }; G.hist.push(o); }
function pop_hist() { let top = G.hist.pop(); G.selist = top.selist; }
function set_g_index(i) { G.i = i; call_question(i); }
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
function toolbar_check() {
	if (isEmpty(G.selist)) { mDisable('bclear'); mDisable('bnext') } else { mEnable('bclear'); mEnable('bnext') }
	if (isEmpty(G.hist)) { mDisable('bback'); } else { mEnable('bback'); }
}
function ui_type_sym_text_line(dParent, item, styles = {}, handler = null) {
	//item must have a sym (or a key w/ exists Syms[key]) and a text
	//console.log('styles',styles)
	//item.style = styles;
	let d = mDiv(dParent, styles, `d_${item.key}`); mFlex(d);
	let sym = valf(item.sym, Syms[item.key]);
	mDiv(d, { family: sym.family, fz: 40 }, null, sym.text);
	//mDiv(d, dict_augment(styles, { family: 'opensans', fz: 20, fg: 'contrast' }), null, item.text);
	mDiv(d, { family: 'opensans', fz: 20 }, null, item.text);
	if (isdef(handler)) { d.onclick = handler; d.setAttribute('item', JSON.stringify(item)); }
	return d;
}

//#region q a
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
	console.log('G', G)
	//assume worried

	//wenn nicht online bin dann sollte simples remedy haben!

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
	let step1 = ''
	//close your eyes
}

//#endregion

//#region youtube
function load_yt_in_iframe(dParent) {

	var div = document.createElement('iframe');
	div.id = 'iframe1';
	mStyle(div, { w: 500, h: 300 });
	mAppend(dParent, div);
	div.src = "https://www.youtube.com/embed/3pNpHZ1yv3I"; //YES!
	//iDiv.src = "https://www.youtube.com/embed/3pNpHZ1yv3I?autoplay=1";

}
function playt() {

	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	var player;
	function onYouTubeIframeAPIReady() {
		player = new YT.Player('player', {
			height: '390',
			width: '640',
			videoId: 'Kopr6Q3oGHw',
			playerVars: {
				'playsinline': 1,
				//autoplay: 1,
				//mute: 1,
			},
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	}

	// 4. The API will call this function when the video player is ready.
	function onPlayerReady(event) {
		console.log('player is ready - please click anywhere on page')
		onclick = () => event.target.playVideo();
	}

	// 5. The API calls this function when the player's state changes.
	//    The function indicates that when playing a video (state=1),
	//    the player should play for six seconds and then stop.
	var done = false;
	function onPlayerStateChange(event) {
		if (event.data == YT.PlayerState.PLAYING && !done) {
			// setTimeout(stopVideo, 6000);
			setTimeout(volume_up, 2000);
			done = true;
		}
	}
}
//#endregion








