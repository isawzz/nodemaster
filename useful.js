

function toggle_select(pic, selected, clSelected = 'selected', clUnselected = null) {
	//if selected is a list, pic is added or removed from it
	//if selected is an object, it is unselected
	//if selected is not defined or null, ignore
	//	console.log(pic)
	let ui = iDiv(pic);
	console.log('div', ui);

	// mClass(ui,'selected'); //ui.classList.add('selected'); //ui.style.background='blue'; mClass(ui,clSelected);
	// return;

	pic.isSelected = !pic.isSelected;
	if (pic.isSelected) {
		if (isdef(clUnselected)) mClassRemove(ui, clUnselected);
		mClass(ui, clSelected);
	} else {
		mClassRemove(ui, clSelected);
		if (isdef(clUnselected)) mClass(ui, clUnselected);
	}

	//if piclist is given, add or remove pic according to selection state
	if (isdef(selected)) {
		if (isList(selected)) {
			if (pic.isSelected) {
				console.assert(!selected.includes(pic), 'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
				selected.push(pic);
			} else {
				console.assert(selected.includes(pic), 'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
				removeInPlace(selected, pic);

			}
		} else {
			mClassRemove(iDiv(selected), clSelected);
			if (isdef(clUnselected)) mClass(iDiv(selected), clUnselected);
			selected.isSelected = false;
		}
	}
	return pic.isSelected ? pic : null;
}

function show_emos() {

	//dTable = mBy('map'); mCenterCenterFlex(dTable);
	let d = mDiv(dTable, { box: true, padding: 20, wmin:600 });
	//console.log('!!!', EMO);
	for (const k in EMO.emoscale) {
		let emo = EMO.emoscale[k];
		//old code
		//let item = Syms[emo.key];
		//ui_type_item(dTable, item, { bg: emo.color }, null, emo.list.split(',').join('<br>')); //,{bg:emo.color,padding:10})

		//new code
		let sym = Syms[emo.key];
		let item = { name:k, key:emo.key, text: sym.text, color: emo.color, family: sym.family, list: emo.list };
		//mDiv(dTable, { bg:'red', family: family, fz:fz }, item[p]);	break;
		//console.log('item',item)
		let handler = question2; // ev => { evNoBubble(ev); question2(ev) };
		let d1=ui_type_item_line(d, item, { cursor:'pointer', aitems: 'center', vpadding: 6, hpadding:12, gap: 4, margin: 6, rounding: 12, bg: item.color, fg: 'contrast' }, handler, ['text', 'list']); // emo.list.split(',').join('<br>')); //,{bg:emo.color,padding:10})

		iAdd(item,{div:d1});
		//mLinebreak(d)
	}
	//mFall(d); //mAppear(d,2500)
}
function test14() {
	say('what do you feel right now???','uk',show_emos,.5,.8);
	//show_emos();

	// dTable = mBy('map');
	// //let speech = new Speaker();
	// //console.log('EMO',EMO);
	// //say('how are you feeling???', 'david', show_emos, 1, .75);
	// //say('how are you feeling???', 'zira', () => { ui_type_item(dTable, Syms[rChoose(SymKeys)]); }, 1, .8);
	// say('which emotions do you feel right now???', 'zira', () => {
	// 	console.log('!!!', EMO);
	// 	for (const k in EMO.emoscale) {
	// 		let emo = EMO.emoscale[k];
	// 		let item = Syms[emo.key];
	// 		console.log('item', item, emo.key);
	// 		ui_type_item(dTable, item,{},null,emo.E); //,{bg:emo.color,padding:10})
	// 	}
	// }, 1, .8);

}

function createViewerContent(mygames, tables = [], show_key = false) {
	let mydata = uiGetViewerStylesAndStart();
	mydata += uiGetViewer(mygames, tables, show_key);
	return mydata;
}
function uiGetViewerStylesAndStart() {
	let mydata = `
	<style>
		@keyframes appear{

			0%{opacity:0;transform: translateY(50px)}
			100%{opacity:1;transform: translateY(0px)}
 		}

 		.contact{
 			cursor:pointer;
 			transition: all .5s cubic-bezier(0.68, -2, 0.265, 1.55);
	 	}

	 	.contact:hover{
	 		transform: scale(1.1);
	 	}

	</style>
	<div id='game_menu' style="text-align: center; animation: appear 1s ease">
  `;
	return mydata;
}
function uiGetViewerItem(item, tables = [], show_key) {
	let bg = randomColor(); //getColorDictColor(item.color);

	return `
	<div onclick="start_game(event)" gamename=${item.id} style='overflow:hidden;cursor:pointer;border-radius:10px;margin:10px;padding:5px;padding-top:15px;width:120px;min-height:90px;display:inline-block;background:${bg}'>
	<span style='font-size:50px;font-family:${item.family}'>${item.text}</span><br>${show_key ? item.key : item.E}</div>
	`;
}
function uiGetViewer(mygames, tables, show_key) {
	mydata = '';
	for (const row of mygames) {
		mydata += uiGetViewerItem(row, tables, show_key);
	}
	return mydata;
}


function _sayYES() {
	if ('speechSynthesis' in window) {
		speechSynthesis.onvoiceschanged = function () {
			DA.voicelist = speechSynthesis.getVoices();
			console.log('voices loaded...');
			return;
			if (nundef(DA.voicelist)) {
				DA.voicelist = [];
				speechSynthesis.getVoices().forEach(function (voice, index) { DA.voicelist.push({ name: voice.name, index: index, voice: voice }); });
			}
		}

		var text = 'Hello, world!';
		var msg = new SpeechSynthesisUtterance();
		var voices = window.speechSynthesis.getVoices();
		//voices.map(x=>console.log('voice',x.name,x))
		msg.voice = rChoose(voices);
		console.log('________es spricht', DA.voicelist)
		msg.rate = 1;
		msg.pitch = 1;
		msg.text = text;

		msg.onend = function (e) {
			console.log('ENDE', e, 'Finished in ' + event.elapsedTime + ' seconds.');
			console.log('voicelist', DA.voicelist)
		};

		speechSynthesis.speak(msg);
	}
}

function sayYES() {
	if ('speechSynthesis' in window) {
		speechSynthesis.onvoiceschanged = function () {
			if (nundef(DA.voicelist)) {
				DA.voicelist = [];
				speechSynthesis.getVoices().forEach(function (voice, index) { DA.voicelist.push(voice.name); });
			}
		}

		var text = 'Hello, world!'
		var msg = new SpeechSynthesisUtterance();
		var voices = window.speechSynthesis.getVoices();
		msg.voice = rChoose(voices);
		msg.rate = 1;
		msg.pitch = 1;
		msg.text = text;

		msg.onend = function (e) {
			console.log('Finished in ' + event.elapsedTime + ' seconds.');
		};

		speechSynthesis.speak(msg);
	}
}

function _say(text) {

	Speech.say(text);

	//let sp=new Speaker('D');
	//setTimeout(()=>sp.say('hallo wie gehts'),2000);


	return;
	'speechSynthesis' in window ? console.log("Web Speech API supported!") : console.log("Web Speech API not supported :-(")

	const synth = window.speechSynthesis;
	let ourText = "Hey there what's up!!!!"
	const utterThis = new SpeechSynthesisUtterance();

	utterThis.text = ourText
	synth.speak(utterThis)
}
function say_form() {
	synth.speak(utterThis)
	const textInputField = document.querySelector("#text-input")
	const form = document.querySelector("#form")
	const utterThis = new SpeechSynthesisUtterance()
	const synth = window.speechSynthesis
	let ourText = ""

	const checkBrowserCompatibility = () => {
		"speechSynthesis" in window
			? console.log("Web Speech API supported!")
			: console.log("Web Speech API not supported :-(")
	}

	checkBrowserCompatibility()

	form.onsubmit = (event) => {
		event.preventDefault()
		ourText = textInputField.value
		utterThis.text = ourText
		synth.speak(utterThis)
		textInputField.value = ""
	}
}



//#region node js server
//file uploading POST routes
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './y/' + file.fieldname + '/');
	},
	filename: function (req, file, callback) { callback(null, file.originalname); }
});
var upload = multer({ storage: storage });

app.post('/perlen', upload.array('perlen'), (req, res) => {
	res.redirect('/');
	console.log('#files', Object.keys(req.files));
	// //console.log(Object.keys(req.files[0]));
	// req.files.map(x => simple.addPerle(x.filename, false)); //console.log(x.filename));
	// console.log('perlen#', Object.keys(simple.perlenDict).length);
});
//#endregion

class FileUploadForm {
	constructor(dParent, title, route, onSubmit) {
		this.dParent = dParent;
		this.title = title;
		this.route = route;
		this.onSubmit = onSubmit;
		let id = this.id = getUID();
		//this.uploadUrl = SERVERURL + route;
		this.createHtml(route)
	}

	// bretter(){this.createHtml('bretter');}
	// perlen(){this.createHtml('perlen');}
	createHtml(route) {
		// <p>${this.title}!</p>
		let elem = mCreateFrom(`
		<div>
			<form action="https://localhost:3000${route}" enctype="multipart/form-data" method="post">
				<input type="file" name="${route}" accept='*' multiple>
				<input type="submit" value="Upload">
			</form>  
		</div>
		`);
		mAppend(this.dParent, elem);
	}

}



function pos_div(elem, x, y) { mStyle(elem, { x: x, y: y }); }
function pos_canvas(elem, x, y) { mStyle(elem, { x: x, y: y }); }
function nodes_on_canvas(dParent, n = 10, dmin = 25) {
	dTable = toElem(dParent);
	let r = getRect(dTable);
	let [w, h] = [r.w, r.h];
	console.log('r', r.w, 'x', r.h);
	let c = mCanvas(dParent, { w: r.w, h: r.h, rounding: 0, bg: 'white' }); let [cv, cx] = [c.cv, c.cx];

	let gran = dmin;
	let [xoffset, yoffset] = [Math.floor((w % gran) / 2), Math.floor((h % gran) / 2)];
	let [xstart, ystart] = [gran / 2, gran / 2];
	let [x, y] = [xstart, ystart];
	let items = []; let [rows, cols] = [0, 0];
	while (y < h) {
		while (x < w - gran / 2) {
			//draw point on x,y
			let styles = { w: 5, h: 5, bg: 'blue', position: 'absolute', x: x, y: y };
			let d = cRect(x, y, styles.w, styles.h, styles, cx); //cEllipse(x,y,styles.w,styles.h,styles,0,cx);
			x += gran;
			let item = { div: d }; copyKeys(styles, item, { position: true });
			items.push(item);
			cols++;
		}
		rows++;
		x = xstart;
		y += gran;
	}


}
function nodes_on_div(dParent, n = 10, dmin = 35) {
	dTable = toElem(dParent); mStyle(dTable, { position: 'relative' });
	let r = getRect(dTable);
	console.log('r', r.w, 'x', r.h);

	//how to generate n random positions on a rectangle?
	let [w, h] = [r.w, r.h];
	let w2h = w / h;
	console.log('w2h', w2h);
	let a = w * h / 1000;
	let pv = a / n;
	console.log('area', a, pv, 'pro vertex');

	let l = Math.sqrt(pv);

	//eq w*h=10]
	//h=600,w=900
	//h=
	//ein field ist 100x100
	//first point auf 50,50
	let gran = dmin;
	let [xoffset, yoffset] = [Math.floor((w % gran) / 2), Math.floor((h % gran) / 2)];
	let [xstart, ystart] = [gran / 2, gran / 2];
	let [x, y] = [xstart, ystart];
	let items = []; let [rows, cols] = [0, 0];
	while (y < h) {
		while (x < w - gran / 2) {
			//draw point on x,y
			let styles = { w: 5, h: 5, bg: 'blue', position: 'absolute', x: x, y: y };
			let d = mDiv(dTable, styles);
			x += gran;
			let item = { div: d }; copyKeys(styles, item, { position: true });
			items.push(item);
			cols++;
		}
		rows++;
		x = xstart;
		y += gran;
	}

	console.log('items', items, cols / rows, rows)


}

function _mAutocomplete(dParent) {

	let d = mDiv(dParent, {}, null, `<form autocomplete="off" action="javascript:void(0);">
			<div class="autocomplete" style="width: 300px">
				<input id="myInput" type="text" name="myCountry" placeholder="Country" />
			</div>
			<input type="submit" />
		</form>
	`);

	function autocomplete(inp, arr) {
		/*the autocomplete function takes two arguments, the text field element and an array of possible autocompleted values:*/
		var currentFocus;
		/*execute a function when someone writes in the text field:*/
		inp.addEventListener('input', function (e) {
			var a,
				b,
				i,
				val = this.value;
			/*close any already open lists of autocompleted values*/
			closeAllLists();
			if (!val) {
				return false;
			}
			currentFocus = -1;
			/*create a DIV element that will contain the items (values):*/
			a = document.createElement('DIV');
			a.setAttribute('id', this.id + 'autocomplete-list');
			a.setAttribute('class', 'autocomplete-items');
			/*append the DIV element as a child of the autocomplete container:*/
			this.parentNode.appendChild(a);
			/*for each item in the array...*/
			for (i = 0; i < arr.length; i++) {
				/*check if the item starts with the same letters as the text field value:*/
				if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
					/*create a DIV element for each matching element:*/
					b = document.createElement('DIV');
					/*make the matching letters bold:*/
					b.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>';
					b.innerHTML += arr[i].substr(val.length);
					/*insert a input field that will hold the current array item's value:*/
					b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
					/*execute a function when someone clicks on the item value (DIV element):*/
					b.addEventListener('click', function (e) {
						/*insert the value for the autocomplete text field:*/
						inp.value = this.getElementsByTagName('input')[0].value;
						/*close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/
						closeAllLists();
					});
					a.appendChild(b);
				}
			}
		});
		/*execute a function presses a key on the keyboard:*/
		inp.addEventListener('keydown', function (e) {
			var x = document.getElementById(this.id + 'autocomplete-list');
			if (x) x = x.getElementsByTagName('div');
			if (e.keyCode == 40) {
				/*If the arrow DOWN key is pressed,
		increase the currentFocus variable:*/
				currentFocus++;
				/*and and make the current item more visible:*/
				addActive(x);
			} else if (e.keyCode == 38) {
				//up
				/*If the arrow UP key is pressed,
		decrease the currentFocus variable:*/
				currentFocus--;
				/*and and make the current item more visible:*/
				addActive(x);
			} else if (e.keyCode == 13) {
				/*If the ENTER key is pressed, prevent the form from being submitted,*/
				e.preventDefault();
				if (currentFocus > -1) {
					/*and simulate a click on the "active" item:*/
					if (x) x[currentFocus].click();
				}
			}
		});
		function addActive(x) {
			/*a function to classify an item as "active":*/
			if (!x) return false;
			/*start by removing the "active" class on all items:*/
			removeActive(x);
			if (currentFocus >= x.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = x.length - 1;
			/*add class "autocomplete-active":*/
			x[currentFocus].classList.add('autocomplete-active');
		}
		function removeActive(x) {
			/*a function to remove the "active" class from all autocomplete items:*/
			for (var i = 0; i < x.length; i++) {
				x[i].classList.remove('autocomplete-active');
			}
		}
		function closeAllLists(elmnt) {
			/*close all autocomplete lists in the document, except the one passed as an argument:*/
			var x = document.getElementsByClassName('autocomplete-items');
			for (var i = 0; i < x.length; i++) {
				if (elmnt != x[i] && elmnt != inp) {
					x[i].parentNode.removeChild(x[i]);
				}
			}
		}
		/*execute a function when someone clicks in the document:*/
		document.addEventListener('click', function (e) {
			closeAllLists(e.target);
		});
	}

	/*An array containing all the country names in the world:*/
	var countries = [
		'Afghanistan',
		'Albania',
		'Algeria',
		'Andorra',
		'Angola',
		'Anguilla',
		'Antigua & Barbuda',
		'Argentina',
		'Armenia',
		'Aruba',
		'Australia',
		'Austria',
		'Azerbaijan',
		'Bahamas',
		'Bahrain',
		'Bangladesh',
		'Barbados',
		'Belarus',
		'Belgium',
		'Belize',
		'Benin',
		'Bermuda',
		'Bhutan',
		'Bolivia',
		'Bosnia & Herzegovina',
		'Botswana',
		'Brazil',
		'British Virgin Islands',
		'Brunei',
		'Bulgaria',
		'Burkina Faso',
		'Burundi',
		'Cambodia',
		'Cameroon',
		'Canada',
		'Cape Verde',
		'Cayman Islands',
		'Central Arfrican Republic',
		'Chad',
		'Chile',
		'China',
		'Colombia',
		'Congo',
		'Cook Islands',
		'Costa Rica',
		'Cote D Ivoire',
		'Croatia',
		'Cuba',
		'Curacao',
		'Cyprus',
		'Czech Republic',
		'Denmark',
		'Djibouti',
		'Dominica',
		'Dominican Republic',
		'Ecuador',
		'Egypt',
		'El Salvador',
		'Equatorial Guinea',
		'Eritrea',
		'Estonia',
		'Ethiopia',
		'Falkland Islands',
		'Faroe Islands',
		'Fiji',
		'Finland',
		'France',
		'French Polynesia',
		'French West Indies',
		'Gabon',
		'Gambia',
		'Georgia',
		'Germany',
		'Ghana',
		'Gibraltar',
		'Greece',
		'Greenland',
		'Grenada',
		'Guam',
		'Guatemala',
		'Guernsey',
		'Guinea',
		'Guinea Bissau',
		'Guyana',
		'Haiti',
		'Honduras',
		'Hong Kong',
		'Hungary',
		'Iceland',
		'India',
		'Indonesia',
		'Iran',
		'Iraq',
		'Ireland',
		'Isle of Man',
		'Israel',
		'Italy',
		'Jamaica',
		'Japan',
		'Jersey',
		'Jordan',
		'Kazakhstan',
		'Kenya',
		'Kiribati',
		'Kosovo',
		'Kuwait',
		'Kyrgyzstan',
		'Laos',
		'Latvia',
		'Lebanon',
		'Lesotho',
		'Liberia',
		'Libya',
		'Liechtenstein',
		'Lithuania',
		'Luxembourg',
		'Macau',
		'Macedonia',
		'Madagascar',
		'Malawi',
		'Malaysia',
		'Maldives',
		'Mali',
		'Malta',
		'Marshall Islands',
		'Mauritania',
		'Mauritius',
		'Mexico',
		'Micronesia',
		'Moldova',
		'Monaco',
		'Mongolia',
		'Montenegro',
		'Montserrat',
		'Morocco',
		'Mozambique',
		'Myanmar',
		'Namibia',
		'Nauro',
		'Nepal',
		'Netherlands',
		'Netherlands Antilles',
		'New Caledonia',
		'New Zealand',
		'Nicaragua',
		'Niger',
		'Nigeria',
		'North Korea',
		'Norway',
		'Oman',
		'Pakistan',
		'Palau',
		'Palestine',
		'Panama',
		'Papua New Guinea',
		'Paraguay',
		'Peru',
		'Philippines',
		'Poland',
		'Portugal',
		'Puerto Rico',
		'Qatar',
		'Reunion',
		'Romania',
		'Russia',
		'Rwanda',
		'Saint Pierre & Miquelon',
		'Samoa',
		'San Marino',
		'Sao Tome and Principe',
		'Saudi Arabia',
		'Senegal',
		'Serbia',
		'Seychelles',
		'Sierra Leone',
		'Singapore',
		'Slovakia',
		'Slovenia',
		'Solomon Islands',
		'Somalia',
		'South Africa',
		'South Korea',
		'South Sudan',
		'Spain',
		'Sri Lanka',
		'St Kitts & Nevis',
		'St Lucia',
		'St Vincent',
		'Sudan',
		'Suriname',
		'Swaziland',
		'Sweden',
		'Switzerland',
		'Syria',
		'Taiwan',
		'Tajikistan',
		'Tanzania',
		'Thailand',
		"Timor L'Este",
		'Togo',
		'Tonga',
		'Trinidad & Tobago',
		'Tunisia',
		'Turkey',
		'Turkmenistan',
		'Turks & Caicos',
		'Tuvalu',
		'Uganda',
		'Ukraine',
		'United Arab Emirates',
		'United Kingdom',
		'United States of America',
		'Uruguay',
		'Uzbekistan',
		'Vanuatu',
		'Vatican City',
		'Venezuela',
		'Vietnam',
		'Virgin Islands (US)',
		'Yemen',
		'Zambia',
		'Zimbabwe',
	];

	/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
	autocomplete(document.getElementById('myInput'), countries);

}

async function cities_add_continent() {
	let info = await route_path_yaml_dict('../base/assets/lists/info.yaml');
	let cities = await route_path_yaml_dict('../base/mapdata/cities.yaml');
	let new_cities = {};

	console.log('cities', arrTake(dict2list(cities), 25));
	return;
	//mach einen reverse index von  country zu continent
	let di = {};
	for (const continent in Geo.continents) {
		for (const country of Geo.continents[continent]) {
			di[country] = continent;
		}
	}


	for (const name in cities) {
		let o = cities[name];
		new_cities[name] = `${o.lng},${o.lat},${o.country},${o.capital},${o.population},${o.continent}`;
	}

	downloadAsYaml(new_cities, 'cities');
	return new_cities;

}

function _create_router(map, color, callback) {
	console.log('haaaaaaaaaaaaaaaaaaaaaa')
	let control = M.router = L.Routing.control({
		// waypoints: points_to_waypoints(pts),
		lineOptions: { styles: [{ color: color, opacity: 1, weight: 3 }], },
		draggableWaypoints: false,
		createMarker: function () { return false; },
		show: false,
	}).addTo(map);
	console.log('control', control)
	control.on('routesfound', callback);
}



function walk_path(a, pts = []) {
	if (isEmpty(pts)) return;
	let p0 = pts[0];
	if (is_lat_lng(p0)) { pts = pts.map(x => from_lat_lng(x)) }
	console.log('pts', pts);

	let map = a.home;
	create_path(map, pts, 'blue', e => dowalk(a, e))
}
function dowalk(a, result) {
	let coords = result.routes[0].coordinates.map(x => from_lat_lng(x));
	// console.log('need to walk',a,'from',a.pos,'to',coords[0]);
	console.log('need to walk along', coords);
	movealong(a, coords)

}
function movealong(a, coords) {
	if (isEmpty(coords)) { console.log('ARRIVED!'); return; }
	console.log('shifted', coords.slice(1))
	a.moveto(coords[0]); setTimeout(() => movealong(a, coords.slice(1)), 500);
}
function create_path(map, pts, color, callback) {
	if (nundef(M.router)) M.router = create_router(map, pts, color, callback);
	else M.router.setWaypoints(points_to_waypoints(pts));
}
function create_router(map, pts = [], color = 'transparent', callback = null) {

	if (isdef(M.router)) return;

	let control = M.router = L.Routing.control({
		waypoints: points_to_waypoints(pts),
		lineOptions: { styles: [{ color: color, opacity: 1, weight: 3 }], },
		draggableWaypoints: false,
		createMarker: function () { return false; },
		show: false,
	}).addTo(map);
	//M.coords = [];
	if (callback) control.on('routesfound', callback);

	// control.on('routesfound') = e=> { 
	// 	//console.log('routesfound event: ',e);
	// 	M.routes = e.routes;
	// 	M.num_requests = e.target._requestCount;
	// 	M.routingResult = e.routes[0].coordinates;
	// 	//M.coords = arrExtend(M.coords, e.routes[0].coordinates);
	// 	console.log('M', M)
	// };


}

//_________________
function toRadian(degree) {
	return degree * Math.PI / 180;
}


function _fit_bounds(coordinates) {
	const bounds = new mapboxgl.LngLatBounds(
		coordinates[0],
		coordinates[0]
	);

	// Extend the 'LngLatBounds' to include every coordinate in the bounds result.
	for (const coord of coordinates) {
		bounds.extend(coord);
	}

	// Note there are other options such as easeing animation and maxZoom
	map.fitBounds(bounds, {
		padding: 20
	});

}
function _getDistance(origin, destination) {
	//var distance = getDistance([lat1, lng1], [lat2, lng2]);
	// return distance in meters
	var lon1 = toRadian(origin[1]),
		lat1 = toRadian(origin[0]),
		lon2 = toRadian(destination[1]),
		lat2 = toRadian(destination[0]);

	var deltaLat = lat2 - lat1;
	var deltaLon = lon2 - lon1;

	var a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
	var c = 2 * Math.asin(Math.sqrt(a));
	var EARTH_RADIUS = 6371;
	return c * EARTH_RADIUS * 1000;
}
function get_bounding_box(pts) {
	let latlngs = to_lat_lng(pts); //pts.map(marker => point_to_marker.getLatLng())
	let o = L.latLngBounds(latlngs);
	console.log('latlngBounds', o)
	let res = { l: o._southWest.lng, t: o._northEast.lat, r: o._northEast.lng, b: o._southWest.lat };
	return res;
}
function _fit_points(map, pts, padpercent = 10) {
	//let markers = [marker1, marker2, marker3]

	let box = get_bounding_box(pts);
	// let latlngs = to_lat_lng(pts); //pts.map(marker => point_to_marker.getLatLng())
	// let latlngBounds = L.latLngBounds(latlngs);
	// console.log('latlngBounds', latlngBounds)

	let dlng = Math.abs(box.l - box.r);
	let dlat = Math.abs(box.t - box.b);

	let vpad = dlat * padpercent * .01;
	let hpad = dlng * padpercent * .01;

	let newbox = { l: box.l - hpad, t: box.t + vpad, r: box.r + hpad, b: box.b - vpad };

	map.fitBounds(to_lat_lng([[newbox.t, newbox.l], [newbox.b, newbox.r]])); //latlngBounds);
	// OR with a smooth animation
	// map.flyToBounds(latlngBounds)	
}
function onclick_route() {
	let map = M.map;
	let [p1, p2] = [M.agent.pos, Geo.places.vegagasse];

	//get_distance(p1,p2);

	//fit_points(map,[p1,p2],0);
	//map.setView(get_middle_point(p1,p2),16);
	//map.setBounds()
	create_router(map, [p1, p2], 'red', onroute); //achtung this is async!!!
}


function test6_toolbar() {
	let map = M.map = create_map();
	let agent = M.agent = new Agent(map, .0001, false);

	//let tb = M.toolbar = create_toolbar(map);
	//mButton('route', onclick_route, tb);

	//let pts= [M.agent.pos, Geo.places.vegagasse];
	//get_distance(arrFirst(pts),arrLast(pts));
	//let r=get_bounding_box(pts)
	//console.log('r',r);
	//setTimeout(onclick_route,2000);

	//lat wird groesser richtung east?
	//create_router(map,[M.agent.pos, Geo.places.vegagasse],'red',onroute);
	let pts = [Geo.places.tuerkenschanzpark, Geo.places.vegagasse]
	let color = 'green';
	let callback = e => fit_points(map, e.waypoints, 0);
	let control = M.router = L.Routing.control({
		waypoints: points_to_waypoints(pts),
		lineOptions: { styles: [{ color: color, opacity: 1, weight: 3 }], },
		draggableWaypoints: false,
		createMarker: function () { return false; },
		show: false,
	}).addTo(map);
	control.on('routesfound', e => { fit_points(map, pts); });
	return;

	//M.coords = [];
	// control.on('routesfound', e=>console.log('e',e));
	control.on('routesfound', e => {
		let box = get_bounding_box(pts);
		console.log('pts', pts)
		let dlng = Math.abs(box.l - box.r);
		let dlat = Math.abs(box.t - box.b);
		let pp = 10;
		let vpad = dlat * pp * .01;
		let hpad = dlng * pp * .01;
		let newbox = { l: box.l - hpad, t: box.t + vpad, r: box.r + hpad, b: box.b - vpad };

		console.log('box', box);

		let nlat = box.t + .001;
		let slat = box.b - .001;
		let wlng = box.l - .001;
		let elng = box.r + .001;

		let p1 = [nlat, elng];
		let p2 = [slat, wlng];

		var southWest = new L.LatLng(slat, wlng),
			northEast = new L.LatLng(nlat, elng),
			bounds = new L.LatLngBounds(southWest, northEast);


		let latlngs = to_lat_lng(pts); //pts.map(marker => point_to_marker.getLatLng())
		let o = L.latLngBounds(latlngs);
		// L.marker([40.712, -74.227]).addTo(map);
		// L.marker([40.774, -74.125]).addTo(map);

		map.fitBounds(o, { padding: [25, 25] });

		// $('#fit1').click(function () { map.fitBounds(bounds); });
		// $('#fit2').click(function () { map.fitBounds(bounds, { padding: [50, 50] }); });

		//map.fitBounds(to_lat_lng([p1,p2])); //latlngBounds);

		//console.log('e',e);

		console.log('new pts', p1, p2)
	});

}
function onroute(e) {
	console.log('route!', e)
	fit_points(M.map, e.waypoints, 0);
}


//#region caba **not** used
function activate_arrows(key, f) {
	lookupAddToList(DA, ['arrow_handlers', key], f);
	let di = { ArrowUp: 270, ArrowDown: 90, ArrowLeft: 180, ArrowRight: 0 };
	for (const key in di) {
		if (is_key_down(key)) {
			item.v.a = di[key];
			update_position(item);
			return true;
		}
	}
	return false;

}
function init_custom_canvas_layer() {
	if (typeof (L) !== 'undefined') {

		L.Mixin.TileLoader = {

			_initTileLoader: function () {
				this._tiles = {}
				this._tilesLoading = {};
				this._tilesToLoad = 0;
				this._map.on({
					'moveend': this._updateTiles
				}, this);
				this._updateTiles();
			},

			_removeTileLoader: function () {
				this._map.off({
					'moveend': this._updateTiles
				}, this);
				this._removeTiles();
			},

			_updateTiles: function () {

				if (!this._map) { return; }

				var bounds = this._map.getPixelBounds(),
					zoom = this._map.getZoom(),
					tileSize = this.options.tileSize;

				if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
					return;
				}

				var nwTilePoint = new L.Point(
					Math.floor(bounds.min.x / tileSize),
					Math.floor(bounds.min.y / tileSize)),

					seTilePoint = new L.Point(
						Math.floor(bounds.max.x / tileSize),
						Math.floor(bounds.max.y / tileSize)),

					tileBounds = new L.Bounds(nwTilePoint, seTilePoint);

				this._addTilesFromCenterOut(tileBounds);
				this._removeOtherTiles(tileBounds);
			},

			_removeTiles: function (bounds) {
				for (var key in this._tiles) {
					this._removeTile(key);
				}
			},

			_reloadTiles: function () {
				this._removeTiles();
				this._updateTiles();
			},

			_removeOtherTiles: function (bounds) {
				var kArr, x, y, z, key;
				var zoom = this._map.getZoom();

				for (key in this._tiles) {
					if (this._tiles.hasOwnProperty(key)) {
						kArr = key.split(':');
						x = parseInt(kArr[0], 10);
						y = parseInt(kArr[1], 10);
						z = parseInt(kArr[2], 10);

						// remove tile if it's out of bounds
						if (zoom !== z || x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) {
							this._removeTile(key);
						}
					}
				}
			},

			_removeTile: function (key) {
				this.fire('tileRemoved', this._tiles[key]);
				delete this._tiles[key];
				delete this._tilesLoading[key];
			},

			_tileKey: function (tilePoint) {
				return tilePoint.x + ':' + tilePoint.y + ':' + tilePoint.zoom;
			},

			_tileShouldBeLoaded: function (tilePoint) {
				var k = this._tileKey(tilePoint);
				return !(k in this._tiles) && !(k in this._tilesLoading);
			},

			_tileLoaded: function (tilePoint, tileData) {
				this._tilesToLoad--;
				var k = tilePoint.x + ':' + tilePoint.y + ':' + tilePoint.zoom
				this._tiles[k] = tileData;
				delete this._tilesLoading[k];
				if (this._tilesToLoad === 0) {
					this.fire("tilesLoaded");
				}
			},

			getTilePos: function (tilePoint) {
				tilePoint = new L.Point(tilePoint.x, tilePoint.y);
				var origin = this._map._getNewTopLeftPoint(this._map.getCenter()),
					tileSize = this.options.tileSize;

				return tilePoint.multiplyBy(tileSize).subtract(origin);
			},

			_addTilesFromCenterOut: function (bounds) {
				var queue = [],
					center = bounds.getCenter(),
					zoom = this._map.getZoom();

				var j, i, point;

				for (j = bounds.min.y; j <= bounds.max.y; j++) {
					for (i = bounds.min.x; i <= bounds.max.x; i++) {
						point = new L.Point(i, j);
						point.zoom = zoom;

						if (this._tileShouldBeLoaded(point)) {
							queue.push(point);
						}
					}
				}

				var tilesToLoad = queue.length;

				if (tilesToLoad === 0) { return; }

				// load tiles in order of their distance to center
				queue.sort(function (a, b) {
					return a.distanceTo(center) - b.distanceTo(center);
				});

				this._tilesToLoad += tilesToLoad;

				for (i = 0; i < tilesToLoad; i++) {
					var t = queue[i];
					var k = this._tileKey(t);
					this._tilesLoading[k] = t;
					this.fire('tileAdded', t);
				}
				this.fire("tilesLoading");

			}
		}

	}
	if (typeof (L) !== 'undefined') {
		L.CanvasLayer = L.Class.extend({

			// includes: [L.Mixin.Events, L.Mixin.TileLoader], 
			includes: [L.Evented, L.Mixin.TileLoader],

			options: {
				minZoom: 0,
				maxZoom: 28,
				tileSize: 256,
				subdomains: 'abc',
				errorTileUrl: '',
				attribution: '',
				zoomOffset: 0,
				opacity: 1,
				unloadInvisibleTiles: L.Browser.mobile,
				updateWhenIdle: L.Browser.mobile,
				tileLoader: false // installs tile loading events
			},

			initialize: function (options) {
				var self = this;
				options = options || {};
				//this.project = this._project.bind(this);
				this.render = this.render.bind(this);
				L.Util.setOptions(this, options);
				this._canvas = this._createCanvas();
				// backCanvas for zoom animation
				this._backCanvas = this._createCanvas();
				this._ctx = this._canvas.getContext('2d');
				this.currentAnimationFrame = -1;
				this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
					window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
						return window.setTimeout(callback, 1000 / 60);
					};
				this.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
					window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function (id) { clearTimeout(id); };
			},

			_createCanvas: function () {
				var canvas;
				canvas = document.createElement('canvas');
				canvas.style.position = 'absolute';
				canvas.style.top = 0;
				canvas.style.left = 0;
				canvas.style.pointerEvents = "none";
				canvas.style.zIndex = this.options.zIndex || 0;
				var className = 'leaflet-tile-container leaflet-zoom-animated';
				canvas.setAttribute('class', className);
				return canvas;
			},

			onAdd: function (map) {
				this._map = map;

				// add container with the canvas to the tile pane
				// the container is moved in the oposite direction of the 
				// map pane to keep the canvas always in (0, 0)
				var tilePane = this._map._panes.tilePane;
				var _container = L.DomUtil.create('div', 'leaflet-layer');
				_container.appendChild(this._canvas);
				_container.appendChild(this._backCanvas);
				this._backCanvas.style.display = 'none';
				tilePane.appendChild(_container);

				this._container = _container;

				// hack: listen to predrag event launched by dragging to
				// set container in position (0, 0) in screen coordinates
				if (map.dragging.enabled()) {
					map.dragging._draggable.on('predrag', function () {
						var d = map.dragging._draggable;
						L.DomUtil.setPosition(this._canvas, { x: -d._newPos.x, y: -d._newPos.y });
					}, this);
				}

				map.on({ 'viewreset': this._reset }, this);
				map.on('move', this.redraw, this);
				map.on('resize', this._reset, this);
				map.on({
					'zoomanim': this._animateZoom,
					'zoomend': this._endZoomAnim
				}, this);

				if (this.options.tileLoader) {
					this._initTileLoader();
				}

				this._reset();
			},

			_animateZoom: function (e) {
				if (!this._animating) {
					this._animating = true;
				}
				var back = this._backCanvas;

				back.width = this._canvas.width;
				back.height = this._canvas.height;

				// paint current canvas in back canvas with trasnformation
				var pos = this._canvas._leaflet_pos || { x: 0, y: 0 };
				back.getContext('2d').drawImage(this._canvas, 0, 0);

				// hide original
				this._canvas.style.display = 'none';
				back.style.display = 'block';
				var map = this._map;
				var scale = map.getZoomScale(e.zoom);
				var newCenter = map._latLngToNewLayerPoint(map.getCenter(), e.zoom, e.center);
				var oldCenter = map._latLngToNewLayerPoint(e.center, e.zoom, e.center);

				var origin = {
					x: newCenter.x - oldCenter.x,
					y: newCenter.y - oldCenter.y
				};

				var bg = back;
				var transform = L.DomUtil.TRANSFORM;
				bg.style[transform] = L.DomUtil.getTranslateString(origin) + ' scale(' + e.scale + ') ';
			},

			_endZoomAnim: function () {
				this._animating = false;
				this._canvas.style.display = 'block';
				this._backCanvas.style.display = 'none';
			},

			getCanvas: function () {
				return this._canvas;
			},

			getAttribution: function () {
				return this.options.attribution;
			},

			draw: function () {
				return this._reset();
			},

			onRemove: function (map) {
				this._container.parentNode.removeChild(this._container);
				map.off({
					'viewreset': this._reset,
					'move': this._render,
					'resize': this._reset,
					'zoomanim': this._animateZoom,
					'zoomend': this._endZoomAnim
				}, this);
			},

			addTo: function (map) {
				map.addLayer(this);
				return this;
			},

			setOpacity: function (opacity) {
				this.options.opacity = opacity;
				this._updateOpacity();
				return this;
			},

			setZIndex: function (zIndex) {
				this._canvas.style.zIndex = zIndex;
			},

			bringToFront: function () {
				return this;
			},

			bringToBack: function () {
				return this;
			},

			_reset: function () {
				var size = this._map.getSize();
				this._canvas.width = size.x;
				this._canvas.height = size.y;

				// fix position
				var pos = L.DomUtil.getPosition(this._map.getPanes().mapPane);
				if (pos) {
					L.DomUtil.setPosition(this._canvas, { x: -pos.x, y: -pos.y });
				}
				this.onResize();
				this._render();
			},

			/*
			_project: function(x) {
				var point = this._map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
				return [point.x, point.y];
			},
			*/

			_updateOpacity: function () { },

			_render: function () {
				if (this.currentAnimationFrame >= 0) {
					this.cancelAnimationFrame.call(window, this.currentAnimationFrame);
				}
				this.currentAnimationFrame = this.requestAnimationFrame.call(window, this.render);
			},

			// use direct: true if you are inside an animation frame call
			redraw: function (direct) {
				var domPosition = L.DomUtil.getPosition(this._map.getPanes().mapPane);
				if (domPosition) {
					L.DomUtil.setPosition(this._canvas, { x: -domPosition.x, y: -domPosition.y });
				}
				if (direct) {
					this.render();
				} else {
					this._render();
				}
			},

			onResize: function () {
			},

			render: function () {
				throw new Error('render function should be implemented');
			}

		});

	}
}
function canvas_overlay() {
	let map = create_map({ center: [51.505, -0.09], zoom: 7, preferCanvas: true, baselayer: 'osm' });

	// custom canvas layer (only added)
	var customlayer = L.Layer.extend({
		initialize: function (options) {
			this._map = map;
			this._canvas = null;
			this._frame = null;
			this._delegate = null;
			L.setOptions(this, options);
			this.onAdd();
		},
		onAdd: function () {
			this._canvas = L.DomUtil.create('canvas', 'leaflet-layer custom');

			var size = this._map.getSize();
			this._canvas.width = size.x;
			this._canvas.height = size.y;

			this._map._panes.overlayPane.appendChild(this._canvas);
		}
	});
	new customlayer();

	// markerpin example
	L.Canvas.include({
		_updateMarkerPin0: function (layer) {
			if (!this._drawing || layer._empty()) {
				return;
			}

			var p = layer._point,
				ctx = this._ctx,
				r = layer._radius;

			//console.log('layer', layer, this)
			//this._drawnLayers[layer._leaflet_id] = layer;

			//cEllipse(0, 0, 2*r, 2*r, {}, 0, ctx);
			ctx.beginPath();
			ctx.fillStyle = 'blue';
			ctx.moveTo(p.x, p.y);
			ctx.ellipse(p.x, p.y, r, r, 0, 0, 2 * Math.PI);
			// ctx.lineTo(p.x - 0.58 * r, p.y - r);
			//ctx.arc(p.x, p.y - 2 * r, r, -Math.PI * 1.161, Math.PI * 0.161);
			ctx.closePath();
			ctx.fill();
			// this._fill(ctx, layer);
			//this._fillStroke(ctx, layer);
		},
		_updateMarkerPin_orig: function (layer) {
			if (!this._drawing || layer._empty()) {
				return;
			}

			var p = layer._point,
				ctx = this._ctx,
				r = layer._radius;

			//console.log('layer', layer, this)
			//this._drawnLayers[layer._leaflet_id] = layer;

			//cEllipse(0, 0, 2*r, 2*r, {}, 0, ctx);
			ctx.beginPath();
			ctx.moveTo(p.x, p.y);
			ctx.lineTo(p.x - 0.58 * r, p.y - r);
			ctx.arc(p.x, p.y - 2 * r, r, -Math.PI * 1.161, Math.PI * 0.161);
			ctx.closePath();
			this._fillStroke(ctx, layer);
		},
		_updateMarkerPin: function (layer) {
			if (!this._drawing || layer._empty()) { return; }
			var p = layer._point, ctx = this._ctx, r = layer._radius;
			cEllipse(p.x, p.y, 2 * r, 2 * r, { bg: 'orange' }, 0, ctx);
			// ctx.beginPath();
			// ctx.moveTo(p.x, p.y);
			// ctx.lineTo(p.x - 0.58 * r, p.y - r);
			// ctx.arc(p.x, p.y - 2 * r, r, -Math.PI * 1.161, Math.PI * 0.161);
			// ctx.closePath();
			// this._fillStroke(ctx, layer);
		}

	});


	L.MarkerPin = L.CircleMarker.extend({
		_updatePath: function () {
			this._renderer._updateMarkerPin(this);
		},
		_containsPoint: function (p) {
			var r = this._radius;

			var insideCircle =
				p.add([0, r * 2]).distanceTo(this._point) <= r + this._clickTolerance();

			var a = this._point,
				b = a.subtract([0.58 * r, r]),
				c = a.subtract([-0.58 * r, r]);

			var insideTriangle = true;

			var ap_x = p.x - a.x;
			var ap_y = p.y - a.y;
			var p_ab = (b.x - a.x) * ap_y - (b.y - a.y) * ap_x > 0;
			var p_ac = (c.x - a.x) * ap_y - (c.y - a.y) * ap_x > 0;
			var p_bc = (c.x - b.x) * (p.y - b.y) - (c.y - b.y) * (p.x - b.x) > 0;

			if (p_ac === p_ab) insideTriangle = false;
			if (p_bc !== p_ab) insideTriangle = false;
			return insideTriangle || insideCircle;
		}
	});


	map.createPane("customPane");
	var canvasRenderer = L.canvas({ pane: 'customPane' });
	let pin = new L.MarkerPin([51.505, -0.09], {
		weight: 2,
		fillColor: "red",
		fillOpacity: 0.5,
		color: '#333',
		radius: 5,
		renderer: canvasRenderer
	}).bindPopup('hello').addTo(map);

	return pin;
}
function create_button(map, key = 'hallo', handler, styles, d) {
	if (nundef(d)) d = mDiv(null, { bg: 'random', w: 25, h: 25 });
	if (nundef(handler)) handler = e => console.log('clicked', e.target);
	if (nundef(styles)) styles = { cursor: 'pointer' };
	if (isdef(styles)) mStyle(d, styles);

	L.Control[key] = L.Control.extend({
		onAdd: function (map) { L.DomEvent.on(d, 'click', handler); return d; },
		onRemove: function (map) { L.DomEvent.off(d, 'click', handler) }
	});

	return new L.Control[key]({ position: 'bottomleft' }).addTo(map);

	L.control[key] = function (opts) { return new L.Control[key](opts); }
	return L.control[key]({ position: 'bottomleft', }).addTo(map);
}
function create_control(map, key) {
	L.Control[key] = L.Control.extend({
		onAdd: function (map) {

			//var d = L.DomUtil.create('div');
			//mStyle(d, { bg: 'red', w: 25, h: 25, margin: 'auto' });
			var img = L.DomUtil.create('img'); img.src = '../base/assets/users/felix.jpg'; img.style.width = '40px';

			L.DomEvent.on(img, 'click', e => console.log('clicked', e.target))
			return img;
		},

		onRemove: function (map) {
			// Nothing to do here
			//L.DomEvent.off()
		}
	});

	L.control[key] = function (opts) {
		return new L.Control[key](opts);
	}

	L.control[key]({ position: 'bottomleft' }).addTo(map);
}
function create_toolbar(map, key = 'hallo', styles = {}) {
	addKeys({ cursor: 'pointer', box: true, padding: 14, w: 200, display: 'flex', position: 'topleft' }, styles);
	d = mDiv(null, styles);

	L.Control[key] = L.Control.extend({
		onAdd: function (map) { return d; },
		onRemove: function (map) { }
	});

	return new L.Control[key](styles).addTo(map);

	L.control[key] = function (opts) { return new L.Control[key](opts); }
	return L.control[key]({ position: 'bottomleft', }).addTo(map);
}
function map_toolbutton(map, color, handler) {
	let MyCustomAction = L.Toolbar2.Action.extend({

		options: {
			toolbarIcon: {
				html: mDiv(null, { margin: 'auto', w: 25, h: 25, bg: color }).outerHTML,
				// html: `<span style="font-size:28px">&phone;</span>`,
				tooltip: 'Go to the Eiffel Tower'
			}
		},

		addHooks: handler

	});

	new L.Toolbar2.Control({
		actions: [MyCustomAction]
	}).addTo(map);
}
async function parse_xml() {

	let url = 'https://api.openstreetmap.org/api/0.6/map?bbox=11.54,48.14,11.543,48.145';
	//route_path_text

	var el = xml.nodeType === 9 ? xml.documentElement : xml
	var h = { name: el.nodeName }
	h.content = Array.from(el.childNodes || []).filter(e => e.nodeType === 3).map(e => e.textContent).join('').trim()
	h.attributes = Array.from(el.attributes || []).filter(a => a).reduce((h, a) => { h[a.name] = a.value; return h }, {})
	h.children = Array.from(el.childNodes || []).filter(e => e.nodeType === 1).map(c => h[c.nodeName] = xml2json(c))
	return h
}
function test_control0(map) {
	L.Control.Watermark = L.Control.extend({
		control: null,
		onAdd: function (map) {
			var div = L.DomUtil.create('div');
			div.style = 'background-color: white; border: 1px gray solid; padding: 1px 4px;'
			div.innerHTML = 'Custom control content';
			return div;
		},
		onRemove: function (map) {
		},
		updateContent: function (newContent) {
			this.getContainer().innerHTML = newContent;
		}
	});

	L.control.watermark = function (opts) {
		return new L.Control.Watermark(opts);
	}
	//If you then create your map control with

	var myControl = L.control.watermark({ position: 'bottomleft' }).addTo(map);
	return myControl;
}
function toolbartest(map) {

	var ImmediateSubAction = L.Toolbar2.Action.extend({
		initialize: function (map, myAction) {
			this.map = map;
			this.myAction = myAction;
			L.Toolbar2.Action.prototype.initialize.call(this);
		},
		addHooks: function () {
			this.myAction.disable();
		}
	});
	var World = ImmediateSubAction.extend({
		options: {
			toolbarIcon: {
				html: 'World',
				tooltip: 'See the whole world'
			}
		},
		addHooks: function () {
			this.map.setView([0, 0], 0);
			ImmediateSubAction.prototype.addHooks.call(this);
		}
	});
	var Eiffel = ImmediateSubAction.extend({
		options: {
			toolbarIcon: {
				html: 'Eiffel Tower',
				tooltip: 'Go to the Eiffel Tower'
			}
		},
		addHooks: function () {
			this.map.setView([48.85815, 2.29420], 19);
			ImmediateSubAction.prototype.addHooks.call(this);
		}
	});
	var Cancel = ImmediateSubAction.extend({
		options: {
			toolbarIcon: {
				html: '<i class="fa fa-times"></i>',
				tooltip: 'Cancel'
			}
		}
	});
	var MyCustomAction = L.Toolbar2.Action.extend({
		options: {
			toolbarIcon: {
				className: 'fa fa-eye',
			},
			/* Use L.Toolbar2 for sub-toolbars. A sub-toolbar is,
			 * by definition, contained inside another toolbar, so it
			 * doesn't need the additional styling and behavior of a
			 * L.Toolbar2.Control or L.Toolbar2.Popup.
			 */
			subToolbar: new L.Toolbar2({
				actions: [World, Eiffel, Cancel]
			})
		}
	});
	new L.Toolbar2.Control({
		position: 'topleft',
		actions: [MyCustomAction]
	}).addTo(map);

	return;
	//NOPE:
	map_toolbutton(map, 'red', () => console.log('red'));
	map_toolbutton(map, 'blue', () => console.log('blue'));
	map_toolbutton(map, 'green', () => console.log('green'));
	map_toolbutton(map, 'yellow', () => console.log('yellow'));
	return;

	var MyCustomAction = L.Toolbar2.Action.extend({

		options: {
			toolbarIcon: {
				html: mDiv(null, { margin: 'auto', w: 25, h: 25, bg: 'red' }).outerHTML,
				// html: `<span style="font-size:28px">&phone;</span>`,
				tooltip: 'Go to the Eiffel Tower'
			}
		},

		addHooks: function () {
			map.setView([48.85815, 2.29420], 19);
		}

	});

	new L.Toolbar2.Control({
		actions: [MyCustomAction]
	}).addTo(map);
}


//#endregion

async function _start() {
	let pop = await route_path_json('../base/mapdata/populated.geojson');
	console.log('pop', pop);
	let arr = sortByFunc(pop.features, x => x.properties.nameascii);
	console.log(arr.map(x => x.properties.nameascii));
	let dipop = list2dict(arr,)
	for (const a of arr) {

	}


	let [citylist, capitals] = [M.cities, M.capitals] = await get_cities_and_capitals();
	await load_syms();
	let list = dict2list(citylist).filter(x => x.pop > 1000000 && x.type == 'capital');
	console.log('list', list);

	//for each of these cities, add all the info from pop



	let cities = L.layerGroup();
	let markers = [];
	for (const c of list) {
		let m = L.marker(c.center).bindPopup(c.name).addTo(cities);
		addKeys(c, m);
		markers.push(m);
	}

	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
	var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

	var streets = L.tileLayer(mbUrl, { id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr });

	let layers = 'osm mbsat cartodark watercolor empty labels cartolabels';
	M.layers = { cities: cities };
	toWords(layers).map(x => M.layers[x] = L.tileLayer(Geo.layerInfo[x].url, Geo.layerInfo[x].options));

	var map = M.map = L.map('map', {
		center: citylist.Vienna.center,
		zoom: 2,
		layers: [M.layers.mbsat, cities]
	});

	var baseLayers = {
		'OpenStreetMap': M.layers.osm,
		'Satellite': M.layers.mbsat,
		'Dark': M.layers.cartodark,
		'Mapbox': M.layers.watercolor,
		'Empty': M.layers.empty,
	};

	var overlays = {
		'Cities': cities,
		'Labels': M.layers.labels,
		'CartoLabels': M.layers.cartolabels,
	};

	var layerControl = L.control.layers(baseLayers, overlays).addTo(map);

	mset_bounds(2, 19);

	var scaleControl = L.control.scale({ maxWidth: 150 }).addTo(map);
	return;

	var crownHill = L.marker([39.75, -105.09]).bindPopup('This is Crown Hill Park.');
	var rubyHill = L.marker([39.68, -105.00]).bindPopup('This is Ruby Hill Park.');
	var parks = L.layerGroup([crownHill, rubyHill]);

	var satellite = L.tileLayer(mbUrl, { id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr });
	layerControl.addBaseLayer(satellite, 'Satellite');
	layerControl.addOverlay(parks, 'Parks');
}

function dream2() {
	let o = { center: G }
	let m1 = create_map({ id: 'map' });
}
function twomaps() {
	// create a map in the "map" div, set the view to a given place and zoom
	var map = L.map('map').setView([48.858190, 2.294470], 16);

	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// add a marker in the given location, attach some popup content to it and open the popup
	L.marker([48.858190, 2.294470]).addTo(map)
		.bindPopup('This is the Eiffel Tower<br> Easily customizable.')
		.openPopup();


	// create a map in the "map" div, set the view to a given place and zoom
	var map2 = L.map('map2').setView([48.858190, 2.294470], 16);

	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map2);
}


function movepin(pin) {
	let pos = pin.getLatLng();
	pin.setLatLng([pos.lat + (coin() ? .01 : -.02), pos.lng + (coin() ? .02 : -.01)]);
}

function move_agent(a, posgetter, postransformer, possetter) {
	let pos = posgetter(a);
	pos = postransformer(a, pos);
	possetter(a, pos);
}


async function challenge1() {
	let data = await route_path_json('../base/mapdata/gadm36_AUT_2.json');
	var mapOptions = {
		center: [48.3, 16.3],
		zoom: 10
	}
	var map = new L.map('map', mapOptions);
	var layer = new L.TileLayer(''); //http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
	map.addLayer(layer);
	// var marker = L.marker([48.3, 16.3]); marker.addTo(map);// Adding marker to the map
	geojson = L.geoJson(data, {}).addTo(map);
	for (const f of data.features) {
		let name = f.properties.NAME_2;

		var polygon = extract_polygon(f);

		let bounds = polygon.getBounds();
		let center = bounds.getCenter();
		center = [center.lng, center.lat]; //for some reason vertauscht er die coords!!!

		let c2 = my_poly_center(f);
		if (c2) {
			get_circle(c2, { fg: 'red' }).addTo(map); //continue;
		}
		// if (name == 'Amstetten' || data.features.indexOf(f) == 0){
		// 	console.log('f.geometry',f.geometry)
		// 	console.log('poly', polygon, bounds, center,center.lat,center.lng);
		// 	console.log('center', center.lat, center.lng);
		// 	console.log('c2',c2)
		// }


		let p = get_circle(center).addTo(map); //continue;


		var marker = L.marker(center, { opacity: 0 }); //[48.2, 16.2]);
		marker.addTo(map);
		marker.bindTooltip(f.properties.NAME_2, { direction: 'center', permanent: true, className: 'mylabel', offset: L.point({ x: -30, y: 30 }) }); //, className: "my-label"
	}
}

function get_polygon_centroid(pts) {
	var first = pts[0], last = pts[pts.length - 1];
	if (first.x != last.x || first.y != last.y) pts.push(first);
	var twicearea = 0,
		x = 0, y = 0,
		nPts = pts.length,
		p1, p2, f;
	for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
		p1 = pts[i]; p2 = pts[j];
		f = p1.x * p2.y - p2.x * p1.y;
		twicearea += f;
		x += (p1.x + p2.x) * f;
		y += (p1.y + p2.y) * f;
	}
	f = twicearea * 3;
	return { x: x / f, y: y / f };
}

async function challenge1() {

	let data = await route_path_json('../base/mapdata/gadm36_AUT_2.json');
	// Creating map options
	var mapOptions = {
		center: [48.3, 16.3],
		zoom: 10
	}
	// Creating a map object
	var map = new L.map('map', mapOptions);

	// Creating a Layer object
	var layer = new L.TileLayer(''); //http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

	// Adding layer to the map
	map.addLayer(layer);


	// var marker = L.marker([48.3, 16.3]);// Creating a marker
	// marker.addTo(map);// Adding marker to the map

	geojson = L.geoJson(data, {}).addTo(map);


	for (const f of data.features) {

		var polygon = L.polygon(f.geometry.coordinates);
		//polygon.bindTooltip("My polygon", { permanent: true, direction: "center" }).addTo(map); //.openTooltip()		//break;
		let bounds = polygon.getBounds();
		let center = bounds.getCenter();

		let pts = points_from_feature(f);
		let c2 = get_polygon_centroid(pts);
		// console.log('c2', c2);
		if (isNaN(c2.x) || isNaN(c2.y)) continue;
		center = [c2.y, c2.x];
		console.log('c2', center);

		// continue;
		// console.log('poly', poly, bounds, center,center.lat,center.lng);
		// console.log('center', center.lat, center.lng);
		// center = [center.lng, center.lat]; //for some reason vertauscht er die coords!!!
		var marker = L.marker(center, { opacity: 0 }); //[48.2, 16.2]);
		// var marker = L.marker(c2, { opacity: 0 }); //[48.2, 16.2]);
		marker.addTo(map);
		//console.log(f.properties); //let text = f.properties.NAME_2;
		marker.bindTooltip(f.properties.NAME_2, { direction: 'center', permanent: true, className: 'mylabel' }); //, className: "my-label"
		// break;
	}

}

async function _challenge1() {

	// Creating map options
	var mapOptions = {
		center: [17.385044, 78.486671],
		zoom: 10
	}
	// Creating a map object
	var map = new L.map('map', mapOptions);

	// Creating a Layer object
	var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

	// Adding layer to the map
	map.addLayer(layer);

	// Creating a marker
	var marker = L.marker([17.385044, 78.486671]);

	// Adding marker to the map
	marker.addTo(map);

}
async function _challenge1() {

	// Creating map options
	var mapOptions = {
		center: [48.3, 16.3],
		zoom: 5
	}
	// Creating a map object
	var map = new L.map('map', mapOptions);

	// Creating a Layer object
	var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

	// Adding layer to the map
	map.addLayer(layer);

	// Creating a marker
	var marker = L.marker([48.3, 16.3]);

	// Adding marker to the map
	marker.addTo(map);

}

async function chal2() {
	let data = await route_path_json('../base/mapdata/gadm36_AUT_2.json');
	var map = L.map('map').setView([48.3, 16.3], 5);

	// var tiles = L.tileLayer('').addTo(map);
	var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);

	let m = L.marker([16.3, 48.3]).addTo(map);
	return;


	geojson = L.geoJson(data, {
		// style: style,
		//onEachFeature: onEachFeature,
	}).addTo(map);

	for (const f of data.features) {
		var poly = L.polygon(f.geometry.coordinates);
		let bounds = poly.getBounds();
		let center = bounds.getCenter();
		console.log('poly', poly, bounds, center);

		var marker = new L.marker(center).addTo(map); //opacity may be set to zero
		console.log(f.properties); //let text = f.properties.NAME_2;
		//marker.bindTooltip("hallo", { permanent: true, offset: [0, 0] }); //, className: "my-label"
		break;
	}
	//console.log('data',data.features)
	return;
	data.features.forEach(onEachFeature);
	return;
	states.forEach(function (state) {
		var polygon = L.polygon(state.geometry.coordinates, {
			weight: 1,
			fillOpacity: 0.7,
			color: 'white',
			dashArray: '3'
		}).addTo(map);
	});

}
function _onEachFeature(f) {
	console.log('f', f);

	//how to convert feature to polygon
	var poly = L.polygon(f.geometry.coordinates);
	let bounds = poly.getBounds();
	let center = bounds.getCenter();
	console.log('poly', poly, bounds, center);


	//how to write text only on map
	var marker = new L.marker(center, { opacity: 0 }); //opacity may be set to zero
	let text = f.properties.NAME_2;
	marker.bindTooltip("hallo", { permanent: true, offset: [0, 0] }); //, className: "my-label"
	//marker.addTo(M.map);
}



function leaflet_marker_code_samples() {

	// let marker = L.marker(center);
	//how to add my own marker: https://www.geoapify.com/create-custom-map-marker-icon
	// var myIcon = L.icon({
	// 	iconUrl: '../base/assets/users/felix.jpg',
	// 	iconSize: [30, 30],
	// 	iconAnchor: [0, 0], //x,y offset relative to top left corner of image - for tooltip
	// 	popupAnchor: [15, 0], //x,y offset relative to top left corner of image - for popup
	// 	//shadowUrl: 'my-icon-shadow.png',
	// 	//shadowSize: [68, 95],
	// 	//shadowAnchor: [22, 94]
	// });
	let sz = 25;
	myIcon = L.divIcon({
		className: 'custom-div-icon',
		html: get_img_html('../base/assets/icons/palm.png', { bg: 'red', w: sz, h: sz, border: 'solid medium yellow', rounding: '50%', box: true }),
		//html: get_user_pic_html('felix', sz, 'red solid medium'), //"<div style='background-color:#c30b82;' class='marker-pin'></div><i class='material-icons'>weekend</i>",
		//iconSize: [sz, sz],
		//iconAnchor: [2, 10],
		tooltipAnchor: [5, sz / 2 - 5],
		popupAnchor: [sz / 2 - 5, -5],
	});
	let marker = L.marker(center, { icon: myIcon }).addTo(map);

	// let tt = marker.bindTooltip('hallo!').openTooltip(); tt.addTo(map);
	let tt = marker.bindTooltip('hallo felix!!').openTooltip(); tt.addTo(map);
	let popup = marker.bindPopup('this is your start city!').openPopup(); popup.addTo(map);
}

//test loading google satellite map
//let layer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 22, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }); layer.addTo(map); return;


async function start() {
	map = L.map('map').setView([37.42, -122.05], 12);
	attrLink = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
	attrLinkToner = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';
	var terrainMap = L.tileLayer(
		'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg', {
		attribution: attrLink,
		maxZoom: 18,
	});//.addTo(map);

	var tonerMap = L.tileLayer(
		'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
		attribution: attrLinkToner,
		maxZoom: 18,
	}); //.addTo(map);

	let o = {
		name: 'Show Street Names',
		url: "http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
		layerOptions: {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
			opacity: 1,
			"showOnSelector": false,
			//detectRetina: true, // WAS MACHT DAS?????????????!!!!!!!!!!
			updateWhenIdle: true,
			reuseTiles: true
		},
		type: 'xyz',
		visible: true
	};
	var ov0 = L.tileLayer(o.url, o.layerOptions);


	var watercolorMap = L.tileLayer(
		'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
		attribution: attrLink,
		maxZoom: 18,
	}).addTo(map);

	var baseLayers = {
		"Stamen Terrain": terrainMap,
		"Stamen Toner": tonerMap,
		"Stamen Watercolor": watercolorMap
	};
	var overlays = {
		"Streets": ov0,
		"Stamen Terrain": terrainMap,
		"Stamen Toner": tonerMap,
		"Stamen Watercolor": watercolorMap
	}

	L.control.layers(baseLayers, overlays).addTo(map);
}


function toggle_streets(o) {
	o.layers.overlays.stamen_toner.visible = !o.layers.overlays.stamen_toner.visible;
}
function do_search(o) {
	if (o.queryText && o.queryText.length > 0) {
		console.log('Searching for ' + o.queryText);

		var url = "http://nominatim.openstreetmap.org/search?format=json&q=" + o.queryText;

		$http.get(url).
			success(function (data, status, headers, config) {

				console.log(data);
				o.searchResults = data;

			}).
			error(function (data, status, headers, config) {
				// log error
			});
	}

}

function hallo() {

	var map = M.map = L.map('map', { center: [48.238, 16.344], zoom: 15 });

	let o = {
		queryText: 'Paris',
		searchResults: '',
		defaults: {
			maxZoom: 16
		},
		mapCenter: {
			lat: 48.238,
			lng: 16.344,
			zoom: 15
		},
		layers: {
			baselayers: {
				stamen_watercolor: {
					name: 'watercolor',
					url: "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
					layerOptions: {
						attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
						"showOnSelector": false,
						updateWhenIdle: false,
						reuseTiles: true
					},
					type: 'xyz'
				}
			},
			overlays: {
				stamen_toner: {
					name: 'Show Street Names',
					url: "http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
					layerOptions: {
						attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
						opacity: 0.4,
						"showOnSelector": false,
						detectRetina: true,
						updateWhenIdle: true,
						reuseTiles: true
					},
					type: 'xyz',
					visible: true
				}
			}
		}

	}

	let info = o.layers.baselayers.stamen_watercolor;

	layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', subdomains: ['a', 'b', 'c'] });
	layer.addTo(M.map);
}

function get_layer_satellite() {
	return L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		{ attribution: '&copy; ' + mapLink + ', ' + sourcesLink, maxZoom: 18, });


}


var muell = {
	style: [
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: color,
				width: 3
			}),
			fill: new ol.style.Fill({
				color: colorTrans(color, .1), //'rgba(0, 0, 255, 0.1)'
			})
		})
	]
};

function ensure_city_layer() {
	if (!lookup(M, ['layers', 'city'])) map_add_layer('city');
	return M.layers.city;
}
function map_add_city(o) {
	let layer = ensure_city_layer();
	console.log('city', o)
	let feature = map_add_circle_to_layer(o.lon, o.lat, layer);
	feature.data = o;
}

function map_add_shape(options) {
	// Create a point
	var point = new ol.geom.Point([10, 30]);
	console.log(
		"point coordinates", point.getCoordinates(),
		"extent", point.getExtent(),
		"layout", point.getLayout());

	// Create a line string
	var lineString = new ol.geom.LineString([[0, 0], [10, 0], [10, 10], [0, 10]]);
	console.log(
		"lineString coordinates", lineString.getCoordinates(),
		"extent", lineString.getExtent(),
		"layout", lineString.getLayout());

	// Create a circle
	var circle = new ol.geom.Circle([4, 5], 10);
	console.log(
		"circle center", circle.getCenter(),
		"radius", circle.getRadius(),
		"extent", circle.getExtent(),
		"layout", circle.getLayout());

	// Geometries
	var point = new ol.geom.Point(
		ol.proj.transform([3, 50], 'EPSG:4326', 'EPSG:3857')
	);
	var circle = new ol.geom.Circle(
		ol.proj.transform([2.1833, 41.3833], 'EPSG:4326', 'EPSG:3857'),
		1000000
	);

	// Features
	var pointFeature = new ol.Feature(point);
	var circleFeature = new ol.Feature(circle);

	// Source and vector layer
	var vectorSource = new ol.source.Vector({
		projection: 'EPSG:4326'
	});
	vectorSource.addFeatures([pointFeature, circleFeature]);

	var vectorLayer = new ol.layer.Vector({
		source: vectorSource
	});
}

function ol_add_circle_to_layer(longitude, latitude, layer) {
	var centerLongitudeLatitude = ol.proj.fromLonLat([longitude, latitude]);
	let source = layer.getSource();
	//console.log('source',source);
	let f = new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 14000));
	let x = source.addFeature(f);
	//console.log('result of addFeature',f);
	return f;
}

function ol_add_circle(longitude, latitude, map) {
	var centerLongitudeLatitude = ol.proj.fromLonLat([longitude, latitude]);
	var layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			projection: 'EPSG:4326',
			features: [new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 14000))]
		}),
		style: [
			new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'blue',
					width: 3
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 255, 0.1)'
				})
			})
		]
	});
	map.addLayer(layer);
}

function map_set_center(pos) {
	console.log('pos', pos);
	let di = {
		Redmond: [-122.11, 47.7],
		Vienna: [16.5, 48.2],
		NewYork: [-74.006111, 40.712778],
	};
	let center = ol.proj.fromLonLat(valf(di[pos], pos, di.Vienna));
	M.map.getView().setCenter(center); //ol.proj.transform(pos, 'EPSG:4326', 'EPSG:3857'));
}
function map_set_zoom(zoom = 12) {
	M.map.getView().setZoom(5);
}
function map_clear() {
	for (const k in M.source) { M.source[k].clear(); }
	mBy(M.options.id).innerHTML = '';
}

function fireEvent(elem, x) {
	const event = new Event(x);
	elem.addEventListener(x, (e) => { console.log('fired', x, 'on', elem) }, false);// Listen for the event.
	elem.dispatchEvent(event);// Dispatch the event.
}
function fireClick(elem) {
	if (document.createEvent) {
		console.log('erstes')
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, false);
		//console.log('fireClick: createEvent and node.dispatchEvent exist!!!', node)
		//console.log('****************fireClick: node.onclick exists!!!', node)
		//node.click();
		elem.dispatchEvent(evt);
	} else if (document.createEventObject) {
		//console.log('fireClick: createEventObject and node.fireEvent exist!!!', node)
		console.log('zweiter')

		elem.fireEvent('onclick');
	} else if (typeof elem.onclick == 'function') {
		console.log('drittes')
		//console.log('****************fireClick: node.onclick exists!!!', node)
		elem.onclick();
	}
}










