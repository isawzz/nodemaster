
function show_emos(){
	console.log('EMO',EMO); //return;
	for(const k in EMO.emoscale){
		let emo = EMO.emoscale[k];
		let item = Syms[emo.key];
		console.log('item',item);
		ui_type_item(dTable,item,{},null,true); //,{bg:emo.color,padding:10})
	}
}














