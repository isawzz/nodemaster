
function call_answer(i) { call_func('a' + i); }
function call_question(i) { call_func('q' + i); }
function call_func(name) { let f = window[name]; f(); }
function dec_g_index(i) { set_g_index(G.i - 1); }
function inc_g_index() { set_g_index(G.i + 1); }
function iStrip(item) { delete item.live; }
function mDisable(elem){elem=toElem(elem);mStyle(elem,{cursor:'default',opacity:0});}
function mEnable(elem){elem=toElem(elem);mStyle(elem,{cursor:'pointer',opacity:1});}
function push_hist() { let o = { i: G.i, items: G.selist.map(x => iStrip(x)) }; G.hist.push(o); }
function pop_hist() { let top = G.hist.pop(); G.selist = top.selist; }
function set_g_index(i) { G.i = i; call_question(i); }
function toolbar_check(){
	if (isEmpty(G.selist)) {mDisable('bclear');mDisable('bnext')}	else {mEnable('bclear');mEnable('bnext')}
	if (isEmpty(G.hist)) {mDisable('bback');}	else {mEnable('bback');}
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












