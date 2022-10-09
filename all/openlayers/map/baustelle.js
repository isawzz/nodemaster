
function onclick_cities() {
	let layer = M.layers.city;
	let capitals = rChoose(M.capitals, 50);
	console.log('capitals', capitals);
	for (const c of M.capitals) { 
		console.log('presenting',c)
		map_add_object(M.cities[c], { layer: layer });
	}
}



















