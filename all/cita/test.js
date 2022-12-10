function t0_textarea() { 
	//=> wurde zu show_code_editor in ui
	dTable = mBy('dTable'); mCenterFlex(dTable);
	mDiv(dTable, { w: '100%' }, null, 'Enter Code:');
	let d = mTextArea(25, 120, dTable, { fz: 16, margin: 'auto', padding: 10, outline: 'none', border: 'none' }, 'dCode');
	let dButtons = mDiv(dTable, { display: 'flex', w: '100%' });
	let asave = mLink("javascript:void(0)", dButtons, {}, null, 'Save Code', 'a');
	asave.onclick = db_add_code; //()=>console.log('click save code!');
	let aclear = mLink("javascript:void(0)", dButtons, {}, null, 'Clear Code', 'a');

	aclear.onclick = () => console.log('click clear code!');
}





















