class Agent {
	constructor(home, speed, zackig, aussehen, startpos) {
		this.home = home; //map | parent div | canvas
		this.isMap = is_map(home);
		console.log('is_map?',this.isMap);
		this.pos = isdef(startpos)?startpos:this.isMap?home.options.center:null;
		this.speed = speed;
		this.rGen = zackig ? rFloat : rGaussian;
		this.ui = create_agent(home, aussehen);
		if (isdef(startpos)) this.moveto(startpos);
		//this.movefor(3);
	}
	moveto(coords){
		//on map coords are [lat,lng], on div coords are [x,y]
		if (this.isMap) map_moveto(this.ui,coords); else mPos(this.ui,coords[0],coords[1]);
		this.pos = coords;
	}
	movefor(secs){
		let f = x => x + this.rGen(-this.speed, this.speed); 
		run_for_seconds(secs, () => { map_moveby(this.ui, f, f); })
	}
	move(){
		let f = x => x + rGen(-speed, speed); 
		this.interval = setInterval(()=>map_moveby(this.ui, f, f),50);
	}
	stop_moving(){clearInterval(this.interval);}
	
}