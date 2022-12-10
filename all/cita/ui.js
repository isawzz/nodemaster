function show_code_editor() {
	mHide('fSearch')
	mClear(dTable);
	mDiv(dTable, { w: '100%' }, null, 'Enter Code:');
	let d = mTextArea(25, 120, dTable, { fz: 16, margin: 'auto', padding: 10, outline: 'none', border: 'none' }, 'dCode');
	let dButtons = mDiv(dTable, { display: 'flex', w: '100%' });
	let asave = mLink("javascript:void(0)", dButtons, {}, null, 'Save Code', 'a');
	asave.onclick = db_add_code; //()=>console.log('click save code!');
	let aclear = mLink("javascript:void(0)", dButtons, {}, null, 'Clear Code', 'a');
	aclear.onclick = () => d.value = ''; //console.log('click clear code!');
}
function show_code_list(list) {
	mClear(dTable);
	
	for (const code of list) {
		let d = mDiv(dTable, { w: '100%' });
		let dkw = mDiv(d, {}, null, code.kw);
		let text = code.c; let lines = text.split('\n'); let rows = lines.length; // count lines
		//let minmax = arrMinMax(lines, x => x.length); let max = minmax.max;//find longest line
		let dcode = mDiv(d, {}, null, `<textarea rows=${rows} cols=120>${code.c}</textarea>`);
	}
}






















