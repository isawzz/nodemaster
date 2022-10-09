function Branch(start, end) {
	this.start = start;
	this.end = end;
	
	this.init = [start.x,start.y,end.x,end.y];
	this.children=[];
	this.finished=false;

	this.get_healthy_end = ()=>{return createVector(this.init[2],this.init[3]);}
	this.repair = () =>{
		this.start.x =this.init[0];
		this.start.y =this.init[1];
		this.end.x =this.init[2];
		this.end.y =this.init[3];
	}
	this.jitter = () =>{
		this.end.x += random(-1,1);
		this.end.y += random(-1,1);
	}
	this.show = () => {
		stroke(255);
		line(this.start.x, this.start.y, this.end.x, this.end.y)
	}
	this.branch = (angle,factor=.67) => {
		let dir = p5.Vector.sub(this.end, this.start);
		dir.rotate(angle);
		dir.mult(factor);
		let newend = p5.Vector.add(this.end, dir);
		let b = new Branch(this.end, newend);
		this.children.push(b);
		return b;
	}
}
