
function create_sym(map, key, center, sz, styles) {
	let d1 = mSym(key,null,styles);
	let html = d1.innerHTML;
	let [xoff, yoff] = sz == 'large' ? [136, 150] : sz == 'medium' ? [36, 40] : [16, 18];
	let offset = [xoff,yoff];
	return create_div_marker(map,html,center,sz,offset);
}
function create_fa(map, key, center, styles={}) {
	// let html = `<i class="fa fa-house fa-${sz=='large'?4:1}x"></i>`;
	addKeys({fz:30},styles);
	let d=mCreate('i');
	mStyle(d,styles);
	mClass(d,`fa fa-${key}`);
	let dp=mCreate('div');
	mAppend(dp,d);

	let html = dp.innerHTML; // `<i class="fa fa-${key}" style="font-size:60px;color:red;"></i>`;
	// let html = `<i class="fa fa-house fa-${sz=='large'?4:1}x"></i>`;
	// let html = `<i class="fa fa-house fa-${sz=='large'?4:1}x"></i>`;
	// let html = `<i class="fa fa-house fa-${sz=='large'?4:1}x"></i>`;
	// let html = `<i class="fa fa-house fa-${sz=='large'?4:1}x"></i>`;
	//let [xoff, yoff] = sz == 'large' ? [136, 150] : sz == 'medium' ? [36, 40] : [16, 18];
	let offset=[styles.fz/2,styles.fz/3];
	let className = `custom-div-icon`;

	let res = L.marker(center, { icon: L.divIcon({ iconAnchor: offset, className: className, html: html }) }).addTo(map);
	return res; //create_div_marker(map,html,center,sz,[xoff,yoff]);
}
function create_div_marker(map,html,center,sz,offset){
	
	let res = L.marker(center, { icon: L.divIcon({ iconAnchor: offset, className: `custom-div-icon ${sz}`, html: html }) }).addTo(map);
	return res;

}















