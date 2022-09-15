class Canvas99 {
	constructor(dParent, styles, origin='cc', sz) {
		let res = mCanvas(dParent, styles);
		[this.cv, this.cx] = [res.cv, res.cx];
		this.defaultsize = 25;
		if (isdef(sz)) { this.cv.width = this.cv.height = sz; this.defaultsize = sz/20; }
		this.origin = this.init_origin(origin);
		console.log('origin', this.origin)
		this.cx.translate(this.origin.x, this.origin.y);
		this.items = [];
	}
	reset_transforms(x = 0, y = 0) { this.cx.setTransform(1, 0, 0, 1, this.origin.x + x, this.origin.y + y); }
	init_origin(origin) {
		//origin can be a point {x,y} or any of tl,tc,tr,cl,[cc],cr,bl,bc,br
		if (nundef(origin)) origin = 'cc';
		let pt = origin;
		if (isString(origin)) {
			let v = origin[0], h = origin[1];
			let y = v == 't' ? 0 : v == 'c' ? this.cv.height / 2 : this.cv.height;
			let x = h == 'l' ? 0 : h == 'c' ? this.cv.width / 2 : this.cv.width;
			pt = { x: x, y: y };
		}
		return pt;

	}

	add(o = {}) {
		addKeys({ x: 0, y: 0, color: rColor(50), w: this.defaultsize, h: this.defaultsize, a: 0, draw: null }, o);
		this.items.push(o);
	}

	draw() {
		let cx = this.cx;
		for (const item of this.items) {
			//console.log('item', item)
			if (isdef(item.draw)) item.draw(item, this);
			else cEllipse(item.x, item.y, item.w, item.h, { bg: item.color }, item.a, cx);
		}
	}
}

function draw_walker(item, canvas) {
	let cx = canvas.cx;
	canvas.reset_transforms(item.x, item.y);
	cx.rotate(toRadian(item.a)); 
	cRect(0-item.w/2, 0-item.h/2, item.w, item.h, { bg: item.color }, cx);
}

function draw_car(item, canvas) {
	let cx = canvas.cx;
	canvas.reset_transforms(item.x, item.y);
	cx.rotate(toRadian(item.a)); 
	cRect(0-item.w/2, 0-item.h/2, item.w, item.h, { bg: item.color }, cx);
}
function get_quadrant(a){
	return a>270?4:a>180?3:a>90?2:1;
}



function update_car(item){
	let a1 = item.a;
	let a2= 100; //item.v.a; // angle of velocity
	//say a is 45, current is 0: should be turning left
	//say a is 270 and current is 0: should be turning right!!!
	if (a1!=a2){
		//turn car by 1 deg at a time!
		let q1=get_quadrant(a1);
		let q2 = get_quadrant(a2);
	  
		let clockw = false;

		if (q1 == q2){clockw = a2<a1; }
		else{
			let diff=Math.abs(a2-a1);
			console.log('diff',diff,a2>a1,diff<180);
			if (a2>a1 && diff>180) clockw=true;
			if (a2<a1 && diff < 180) clockw = true;
			//clockw=(a2>a1)?(diff>180)?true:false;//:((diff>180)?true:false);
			
		}
		console.log('should turn '+clockw?'counter-clockwise':'clockwise',q1,q2,a1,a2);

		
		let anew = clockw?a1- 
		//else if (q1==1 && q2==2)
		//if (item.a<a)


	}
	item.a=item.v.a;
	item.x+=Math.cos(item.a)*item.v.mag;
	item.y+=Math.sin(item.a)*item.v.mag;
}






