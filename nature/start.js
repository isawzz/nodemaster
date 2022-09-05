
onload = start;

var cv,cx;
async function start() {
	// await load_syms();

	// dHeader = mSection({ padding: 10, position:'relative' }, 'dHeader', 'Hello!', 'h1');
	// mPuppet('pineapple', dHeader, {position:'absolute', top:6},100);

	dToolbar = mToolbar('sp co','L-sys');


}

function mToolbar(){
	let d = mBy('dToolbar');mFlex(d);mStyle(d,{hpadding:10,gap:10})
	for(const arg of arguments){
		//replace all white spaces by _
		let funcname = replaceWhite(arg);
		mButton(arg,window['onclick_'+funcname],d);

	}
	return d;
}
function onclick_sp_co(){
	//make a canvas?
	[cv,cx]=mCanvas('dTable',600,400);
}














