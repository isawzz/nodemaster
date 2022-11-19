
function get_bstp() {
	const actions = {
		obst: 'apfel orange assorted plum granat',
		veggie: 'karotte kartoffel purree kohlsprossen zwiebel knoblauch assorted',
		backen: 'almondhorn gugelhupf vanillekipferl striezelteig apfelmus marm',
		kochen: 'purree hameggs omelette soup mushroom pizza',
		spaz: 'femto micro macro standard 104 tennis HS safeway libTJ',
		klavier: 'op111 wald1 mond3 etude nocturne ballade ital mozartB mozartKKC kk3_3 kk5_2',
		putzen: 'herd counter kueche eingang guklo stiege loft/guzi wohnzi',
		erltm: 'post zahlen scan emailtm discordtm termin',
		deconstruction: 'video sleep walkthink libthink starbucksthink',
	};
	let time = rNumber(1, 5);
	let points = rNumber(1, 3);
	//you have to fall in love with stillness
	//stillness is: handeln ohne absicht - avoiding harm means avoiding ego

	let key = rChoose(get_keys(actions));
	let val = rChoose(actions[key]);

	console.log('val', val);
	
	//add_edit()

}
















