onload = start; TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}
	await get_cities_and_capitals(); //cities_from_csv_and_info();	return;
	await load_syms();

	let txt = await route_path_text('../caba/fa_symbols.css');
	let parts = txt.split(':before');
	console.log('parts',parts.length);
	let list=[];
	for(const p of parts){
		//console.log('p',p)
		let word = stringAfter(p,'.fa-').trim();
		//console.log('word',word);
		list.push(word);
	}

	console.log('list',list);

	dTable = mBy('map');
	let animations=['beat','bounce','fade','flip','pulse','shake','spin'];//,'beat-fade','spin-pulse']
	let iani=0;
	for (const w of arrTake(list,25)){

		let an = 'pulse';// animations[iani++]; if (iani>animations.length) iani=0; // rChoose(animations);
		let d=mDiv(dTable,{align:'center',bg:'blue',margin:8,fg:'white',display:'inline-block',padding:10},null,`<i class="fa fa-${w} fa-${an} fa-2x"></i><br>${w}`);
		
	}

	//test12_europe(); //faicon_list(); //test13_get_the_div(); //test12_europe();//gTest13(); //test6_click(); //test5_showroute();
	//gTest05(); //test11_gengraph();//test10_autocomplete(); //test9_google(); //test8_load_googlemap_in_iframe(); //test7(); //test6_click(); //test5_showroute(); //test4_tools(); //test3_better_agent(); // test2_two_maps | test0_canvas_overlay
}















