function create_agent(dParent,o={}){

	//what is the default agent?
	//he needs to be on a canvas, or on a map, or what???
	// if dParent is a map, all coordinates are interpreted as lat,long and M.map must be set
	//how do I know that dParent is a map? dParent in that case will be == M.map

	let d=mDiv()

	if (dParent == M.map){
		M.map.createPane("customPane");
		var canvasRenderer = L.canvas({pane:"customPane"});
		var marker = new L.marker([0,0],{renderer:canvasRenderer});
		
	}




}































