function test14_factory(){
	let d=mSym('frog','map');

}

function test13_get_the_div(){
	let map = M.map = create_map({ zoom: 5, center:Geo.cities.stuttgart });
	let dmap=document.getElementById('map');
	let dtiles=dmap.firstChild.firstChild;
	console.log('dtiles',dtiles); //insteressabt nuetzt aber garnix

}

function test12_europe(){
	let map = M.map = create_map({ zoom: 5, center:Geo.cities.stuttgart });

	//get all cities within mapbounds
	//
	let list= get_values(Geo.cities).filter(x=>x.continent == 'Europe' && x.pop >= 1000000 && x.country == 'Austria');
	console.log('list',list);



	for(const c of list){
		// let d1=mSym('horse');
		// let res = L.marker(c.center, {icon: L.divIcon({iconAnchor:[136,150],className: 'custom-div-icon large semitrans',html:d1.innerHTML})}).addTo(map);

		let m = create_fa(map, 'helicopter', c.center);

		break;
		// let icon = L.divIcon();
		// let d=mCreate('div');
		// //mSym('city',d);
		// let html = d.outerHTML;
		// console.log('res',res);
		// let d1=res.getIcon();


		// break;
		// //create_agent(map,c);
	}
	
}
function test11_oest(){
	let map = M.map = create_map({ zoom: 7, center:Geo.cities.salzburg });

	//get all cities within mapbounds
	//
	let list= get_values(Geo.cities).filter(x=>x.country == 'Austria');
	console.log('list',list);

	for(const c of list){
		create_agent(map,c);
	}
	
}

//#region cytograph und board tests
function test14(){
	initTable();

	//eigentlich moecht ich die neighbors von einem ganz normalen quad board haben!
	// schau mal zu board!
	let [dx,dy]=[20,20];
	let centers = quadCenters(20,20,dx,dy)[0];

	let i=0;centers.forEach(x=>{x.idx=i++;x.irow=divInt(x.y,dy),x.icol=divInt(x.x,dx)});
	console.log('centers',centers[30]);

	//centers sind jetzt die items;
	//wie krieg ich neighbors incl diagonal neighbors?


}

function gTest13() {
	let g = createSampleHex1(5, 3, 100, 100); let ids = g.getNodeIds(); let id = ids[0]; g.showExtent();

	//get the center of first node
	let center = g.getProp(id, 'center');//jetzt geht es weil ich bei hex1Board die center prop in jedem node abspeichere!!!
	console.log('center prop', center);
	center = g.posDict['preset'][id];//ja das geht
	console.log('center', center);

	//get size of first node
	let size = g.getSize(id); // das returned eigentlich die bounding box! hab auch x1,y1,x2,y2
	console.log('size', size);

	//get pt in north:
	let pN = { x: center.x, y: size.y1 }; //falsch!
	let node = g.getNode(id);
	let b = node.renderedBoundingBox();
	pN = { x: b.x1 + b.w / 2, y: b.y1 };

	return;
	//create a node there!
	let nNew = g.addNode({ width: 25, height: 25 }, pN);
	console.log('new node', nNew);
	let n1 = g.getNode(nNew);
	n1.css('background-color', 'blue');
	let st = { bg: 'red', shape: 'ellipse', w: 25, h: 25 };
	let st1 = mStyleToCy(st);
	n1.css(st1);



}
function initTable() { dTable = toElem('map'); }
function gTest12() {
	let g = createSampleHex1(21, 11); let ids = g.getNodeIds(); let id = ids[0];

	g.showExtent();
}
function createSampleHex1(rows = 5, topcols = 3, w = 25, h = 25) {
	initTable();
	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink', shape: 'hex', w: w, h: h },
		edge: { bg: 'white' }
	};
	let g = hex1Board(dTable, rows, topcols, styles);
	g.addLayoutControls();
	return g;
}
function gTest11() {
	let g = createSampleHex1();
	let ids = g.getNodeIds();
	let id = ids[0];
	console.log('size', g.getSize(id), g.cy.getElementById(id).bb());
	let n = g.cy.getElementById(id);
	n.css({ width: '40px', height: '40px' });
	g.zoom(false);
	let bb = g.cy.elements().bb();
	console.log('gesamt graph braucht:', bb)
}
function gTest10() {
	initTable();
	let [rows, topcols, w, h] = [7, 10, 50, 50];
	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink', shape: 'hex', w: w, h: h },
		edge: { bg: 'green' }
	};
	let g = hex1Board(dTable, rows, topcols, styles);
}
function gTest09() {
	initTable();
	let [w, h] = [50, 50];
	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink', shape: 'hex', w: w, h: h },
		edge: { bg: 'green' }
	};
	let g = new UIGraph(dTable, styles);
	let [rows, topcols] = [5, 3];
	let total = hex1Count(rows, topcols);
	console.log('for rows', rows, 'and cols', topcols, 'need', total, 'nodes')
	let nids = g.addNodes(total);
	g.hex1(rows, topcols, w + 4, h + 4);
	let indices = hex1Indices(rows, topcols);
	console.log('indices', indices);
	//correct, jetzt soll jeder node die bekommen!
	let ids = g.getNodeIds();
	console.log('node ids:', ids);
	//return;
	let di = {};
	for (let i = 0; i < ids.length; i++) {
		let [row, col] = [indices[i].row, indices[i].col];
		let id = ids[i];
		lookupSet(di, [row, col], id);
		g.setProp(id, 'row', row);
		g.setProp(id, 'col', col);
		g.setProp(id, 'label', `${row},${col}`);
		//g.setStyle(id, 'label', 'data(label)');
	}
	let labels = g.getNodes().map(x => x.data().label);
	console.log('labels', labels);
	let label = g.cy.getElementById(ids[1]).data('label');

	for (let i = 0; i < ids.length; i++) {
		let [row, col] = [indices[i].row, indices[i].col];
		let id = ids[i];
		let nid2 = lookup(di, [row, col + 2]); if (nid2) g.addEdge(id, nid2);
		nid2 = lookup(di, [row + 1, col - 1]); if (nid2) g.addEdge(id, nid2);
		nid2 = lookup(di, [row + 1, col + 1]); if (nid2) g.addEdge(id, nid2);
	}

	let deg = g.getDegree(ids[1]); //cy.getElementById(ids[1]).data('label');
	let deg1 = g.getDegree(ids[10]); //cy.getElementById(ids[1]).data('label');
	let deg2 = g.getDegree(ids[18]); //cy.getElementById(ids[1]).data('label');
	console.log('das geht: label', label, deg, deg1, deg2);

}
function gTest08() {
	initTable();
	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink', shape: 'hex' },
		edge: { bg: 'green' }
	};
	let g = new UIGraph(dTable, styles);
	let nids = g.addNodes(10);
	let eids = g.addEdges(10);
	g.cose();
	g.addLayoutControls();
	let nodes = g.getNodes();
	console.log('nodes', nodes[0]);
	g.mStyle(nodes[0], { shape: 'ellipse', bg: 'black' });
}
function gTest07() {
	initTable();

	//let hexPoints = [{ x: 0, y: -1 }, { x: 1, y: -0.5 }, { x: 1, y: 0.5 }, { x: 0, y: 1 }, { x: -1, y: 0.5 }, { x: -1, y: -0.5 }]
	let hexPoints = [0, -1, 1, -0.5, 1, 0.5, 0, 1, -1, 0.5, -1, -0.5];

	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink', shape: 'hex' },
		edge: { bg: 'blue' }
		// node: { shape: 'polygon', 'shape-polygon-points': hexPoints, w: 90, h: 100, bg: 'black', fg: 'red', fz: 40 },
		//'node.field':  { shape: 'polygon', 'shape-polygon-points': hexPoints, w: 90, h: 100, bg: 'black', fg: 'red', fz: 40 },
		// 'node.city':  { shape: 'circle', w: 25, h: 25, bg: 'violet', fg: 'white', fz: 40 },

	};

	let g = new UIGraph(dTable, styles);
	let cy = g.cy;
	//cy.style({ selector: 'h1', style: { 'background-color': 'grey' } });

	//let nids = g.addNodes(7);nids.map(x=>x.class('field'))
	let nids = g.addNodes(10);
	let eids = g.addEdges(10);

	let node = g.getNodes()[0];
	node.addClass('high');

	g.cose();
	//g.nodeEvent('click', x => { x.addClass('high'); }); //let id = x.id(); console.log('clicked ' + id); g.mStyle(id, { bg: 'yellow', fg: 'blue' }); });

	cy.style().selector('node.field').style('color', 'black');
	cy.style().selector('node.city').style('shape', 'hexagon');



	let node1 = g.getNodes()[1];
	node.addClass('city');
	node1.addClass('field');
}
function gTest06() {
	initTable();

	//let hexPoints = [{ x: 0, y: -1 }, { x: 1, y: -0.5 }, { x: 1, y: 0.5 }, { x: 0, y: 1 }, { x: -1, y: 0.5 }, { x: -1, y: -0.5 }]
	let hexPoints = [0, -1, 1, -0.5, 1, 0.5, 0, 1, -1, 0.5, -1, -0.5];

	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink' },
		edge: { bg: 'blue' }
		// node: { shape: 'polygon', 'shape-polygon-points': hexPoints, w: 90, h: 100, bg: 'black', fg: 'red', fz: 40 },
		//'node.field':  { shape: 'polygon', 'shape-polygon-points': hexPoints, w: 90, h: 100, bg: 'black', fg: 'red', fz: 40 },
		// 'node.city':  { shape: 'circle', w: 25, h: 25, bg: 'violet', fg: 'white', fz: 40 },

	};

	let g = new UIGraph(dTable, styles);
	let cy = g.cy;
	//cy.style({ selector: 'h1', style: { 'background-color': 'grey' } });

	//let nids = g.addNodes(7);nids.map(x=>x.class('field'))
	let nids = g.addNodes(10);
	let eids = g.addEdges(10);

	let node = g.getNodes()[0];
	node.addClass('high');

	g.cose();
	//g.nodeEvent('click', x => { x.addClass('high'); }); //let id = x.id(); console.log('clicked ' + id); g.mStyle(id, { bg: 'yellow', fg: 'blue' }); });

	cy.style().selector('node.field').style('color', 'black');
	cy.style().selector('node.city').style('shape', 'hexagon');

	let node1 = g.getNodes()[1];
	node.addClass('city');
	node1.addClass('field');
}
function gTest05() {
	dTable = toElem('map');

	//let hexPoints = [{ x: 0, y: -1 }, { x: 1, y: -0.5 }, { x: 1, y: 0.5 }, { x: 0, y: 1 }, { x: -1, y: 0.5 }, { x: -1, y: -0.5 }]
	let hexPoints = [0, -1, 1, -0.5, 1, 0.5, 0, 1, -1, 0.5, -1, -0.5];

	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { shape: 'polygon', 'shape-polygon-points': hexPoints, w: 90, h: 100, bg: 'black', fg: 'red', fz: 40 }
	};

	let g = new UIGraph(dTable, styles);
	let nids = g.addNodes(17);
	//let eids = g.addEdges(15);
	console.log('g', g.getNodeIds(), g.getEdgeIds());
	//g should be of item form! dh hat id und iDiv!
	g.hex1(5, 2, styles.node.w + 2, styles.node.h + 2);
	g.addLayoutControls();
	g.disableDD(); //cool!!!!
	g.nodeEvent('click', x => { let id = x.id(); console.log('clicked ' + id); g.mStyle(id, { bg: 'yellow', fg: 'blue' }); });
}

function test12_cyto() {

}

function test11_gengraph() {
	//let items = nodes_on_div('map',30,50);	shake_and_sieve(items);
	//let space = create_space('map',)
	let items = create_nodes({ x: 0, y: 0, w: 500, h: 500 }, 20, 120);
	console.log('items', items, items[120]);

	dTable = toElem('map');

	// plot_on_canvas(dTable,items);
	plot_on_div(dTable, items);

	adjacency_init(items);

	//let items = nodes_on_canvas('map',30,50);	shake_and_sieve(items);
}
//#endregion

// #region map tests 0
function test10_autocomplete() {
	let map = M.map = create_map({ zoom: 16 });
	map.on('moveend', function (e) { calc_map_dims(); console.log("dims", M.dims); });

	let tb = M.toolbar = create_toolbar(map);
	mButton('Dummy', dummy_reaction, tb);
	mAutocomplete(tb);

	// let city = rChoose(M.capitals);
	// console.log('city has been chosen:', city);

	// map.flyTo(Geo.cities[city].center);
}

function test9_google() {
	mBy('map').innerHTML = `
	<iframe class='flat' id="gmap" src="http://maps.google.com/maps?z=15&t=m&q=loc:48.25+16.3&output=embed" width="100%" height="${window.innerWidth}"></iframe>	
	`;
	let x = document.getElementById('gmap');
	console.log('x', x);
	mStyle(x, { bg: 'blue' });

}
function test8_load_googlemap_in_iframe() {

	var iDiv = document.createElement('iframe');
	iDiv.id = 'iframe1';
	mStyle(iDiv, { w: '100%', h: '100%' })
	document.getElementById("map").appendChild(iDiv);
	iDiv.src = 'https://maps.google.com/maps?q=48.2,16.3&output=embed';
	// iDiv.src = 'https://maps.google.com/maps?q=48.2,16.3&hl=fa;z=5&ie=UTF8&output=embed&hl=en';
}
function test7_display_dims_on_moveend() {
	let map = M.map = create_map({ zoom: 16 });
	map.on('moveend', function (e) { calc_map_dims(); console.log("dims", M.dims); });

	let city = rChoose(M.capitals);
	console.log('city has been chosen:', city);

	map.flyTo(Geo.cities[city].center);


}
function test6_click() {
	let map = M.map = create_map({ zoom: 16 });

	//calc_map_dims(); console.log('map dims',M.dims); 	return;
	add_click_set_agent();

	let tb = M.toolbar = create_toolbar(map);
	mButton('route', () => {
		map.off('click');
		let pts = M.agents.map(x => x.pos);
		//M.agents = [];
		let color = 'red';
		let callback = e => fit_points(map, pts);

		M.router = show_route(map, pts, color, callback);

	}, tb);

	mButton('clear', () => { clear_router(); clear_agents(); add_click_set_agent(); }, tb);

}

function test5_showroute() {
	let map = M.map = create_map();
	let agent = M.agent = new Agent(map, .0001, false);

	let tb = M.toolbar = create_toolbar(map);
	//mButton('route', onclick_route, tb);

	let pts = [Geo.places.tuerkenschanzpark, Geo.places.vegagasse]
	let color = 'green';
	let callback = e => fit_points(map, pts);

	let control = M.router = show_route(map, pts, color, callback);
}
function test4_tools() {
	let map = create_map();
	console.log('map', map); //map.options hat jetzt all die o params

	//return;

	// modify leaflet control container
	let d = map._controlContainer; //document.getElementsByClassName('leaflet-control-container')[0];
	console.log('control container', d);

	dMap = mDiv(d, { position: 'absolute', top: 0, left: 50, w: '100%', h: '100%' });
	dMap.style.zIndex = 12000;

	dTop = mDiv(dMap, { hmargin: 10, padding: 10, cursor: 'pointer' }, null, null, 'top'); mFlexWrap(dTop);
	let b = mButton('hallo', dummy_reaction, dTop);
	b = mButton('download', () => downloadJson({ hallo: 4343 }, '__test'), dTop);
	let a = mLink("http://duckduckgo.com", dTop, { color: 'dimgray' }, null, 'ein link');
	a = mLink("javascript:void(0)", dTop, { color: 'dimgray' }, null, 'ein link');
	a.onclick = dummy_reaction;
	b = mButton('Paris', () => map.setView(Geo.cities.Paris.center), dTop);
	b = mButton('London', () => map.flyTo(Geo.cities.London.center), dTop);//YEAH!!!!!

	let agent = new Agent(map, .0001, false); //create_agent(map);

	//<a href="javascript:void(0)" class="closebtn">×</a>
	//jetzt 


	return;


	let x = create_toolbar(map); console.log('toolbar', x)
	let tb = x._container; console.log('toolbar', tb);

	mButton('click', () => console.log('clicked!'), tb, { cursor: 'pointer' })
	//let f=create_button(map)
}
async function test3_better_agent() {

	M = create_map();
	console.log('M', M);
	let agent = new Agent(M, .0001, false); //create_agent(map);

	//test_control0(map.map);
	let c1 = create_button(M.map, 'hallo')
	let c2 = create_button(M.map, 'h2')
	let c3 = create_button(M.map, 'h3')
	console.log('buttons', c1, c2, c3)
	//toolbartest(map.map);

}
async function test2_two_maps() {
	let [cities, capitals] = await get_cities_and_capitals();
	let o = { center: cities.Paris.center, zoom: 7, id: 'map' };
	let m1 = create_map(jsCopy(o));
	copyKeys({ id: 'map2', preferCanvas: true }, o);
	let m2 = create_map(o);

	let a1 = create_agent(m1);
	let a2 = create_agent(m2);

	let f1 = x => x + rFloat(-.01, .05);
	let f2 = x => x + rGaussian(-.01, .05); // rAddSubRange(.01);
	run_for_seconds(2, () => { map_moveby(a2, f2, f2); map_moveby(a1, f1, f1); })
}
function test1_maxBounds() { let m1 = create_map({ zoom: 0 }); }
function test0_canvas_overlay() {
	let pin = canvas_overlay();

	let f = x => x + rGaussian(-.01, .04); //-.1,.1);  //rAddSubRange(.01);
	run_for_seconds(2, () => map_moveby(pin, f, f))
}

//#endregion

