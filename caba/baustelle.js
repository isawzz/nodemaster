
function plot_on_canvas(d,items){
	let r = getRect(dTable);
	let c = mCanvas(d,{w:r.w,h:r.h,rounding:0,bg:'white'}); let[cv,cx]=[c.cv,c.cx];

	for(const item of items){
		let d1 = item.div = cRect(item.x,item.y,item.w,item.h,{bg:item.bg},cx); //cEllipse(x,y,styles.w,styles.h,styles,0,cx);
	}
}
function plot_on_div(d,items){
	mStyle(d, { position: 'relative' });
	for(const item of items){
		let d1 = item.div = mDiv(d,{x:item.x,y:item.y,w:item.w,h:item.h,bg:item.bg,rounding:'50%',position:'absolute'}); //cEllipse(x,y,styles.w,styles.h,styles,0,cx);
	}
}
function create_nodes(r,pad,dmin){
	//r should have x,y,w,h components
	let [xstart, ystart, w, h] = [r.x+pad,r.y+pad,r.w, r.h];
	let [x,y]=[xstart,ystart];
	let items = []; let [rows,cols,row,col]=[0,0,0,0];
	while (y < h - dmin) {
		while (x < w - dmin) {
			//draw point on x,y
			let item = { w: 5, h: 5, iy:row, ix:col, bg: 'blue', position: 'absolute', x: x, y: y };
			x += dmin;
			items.push(item);
			cols++;col++;
		}
		rows++;row++;col=0;
		x = xstart;
		y += dmin;
	}
	return items;
}





















