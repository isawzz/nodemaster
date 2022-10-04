onload = start;

async function start() {

	let text = await route_path_text('../base/mapdata/cities.csv');
	let list = csv2list(text);
	console.log('list',list);


	map_init_OSM();

	for(const o of arrTake(cities,10)){
		//add a circle for these cities!
	}
	//map_init({url:'../base/mapdata/ecoregions.json'});
}


function csv2list(allText, hasHeadings = true) {
	var numHeadings = 11;  // or however many elements there are in each row
	var allTextLines = allText.split(/\r\n|\n/);
	//console.log('found',allTextLines.length,'text lines!!!');
	var headings = allTextLines[0].split(',');
	numHeadings = headings.length;
	//console.log('headings',numHeadings,headings);
	let entries = allTextLines.splice(1);
	//entries = entries.slice(0,10);
	//entries.map(x=>console.log(x)); 
	var records = [];
	for (const e of entries) {
		let o = {};
		let values = e.split(',');
		for (let i = 0; i < numHeadings; i++) {
			let k = headings[i];
			o[k] = values[i];
		}
		records.push(o);
	}
	//console.log('recordsByName',recordsByName)
	return records;
}

