
function show_reasons() {

	dTable = mBy('map'); clearElement(dTable); mCenterCenterFlex(dTable);
	let d = mDiv(dTable, { box: true, padding: 20, opacity: 0, w: '80%' });
	//console.log('!!!', EMO);
	let reasons = [
		{list:'I don\'t know',color:'beige'},
		{list:'Because of some outer event that is bothering me',color:'crimson'},
		{list:'There is no specific reason',color:'grey'}
	]
	for (const k of reasons) {
		let item = k; //{ list: reason, color: emo.color, family: sym.family, list: emo.list };
		//mDiv(dTable, { bg:'red', family: family, fz:fz }, item[p]);	break;
		//console.log('item',item)
		let handler = question3; // ev => { evNoBubble(ev); question2(ev) };
		ui_type_item_line(d, item, { cursor:'pointer', aitems: 'center', padding: 6, gap: 4, margin: 6, rounding: 12, bg: item.color, fg: 'contrast' }, handler, ['list']);
		//mLinebreak(d)
	}
	mAppear(d,2500)
}
function question3(ev){
	console.log('ev.target',ev.target)
}













