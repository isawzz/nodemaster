function engine_go(e) {
	const matrix={
		a:{
			click:()=>add_agent_at(M.map,[e.latlng.lat, e.latlng.lng]),
			route:()=>{M.event='route',M.state='r';engine_go()}
		},
		r:{

		},
	}
	switch (M.state) {
		case 'a':
			switch(event){
				case 'click': break;
				case 'route': M.state = 'r'; break;
				case 'clear': break;
			}
			break;
		case 'r':
			break;
		default:
			break;
	}
}














