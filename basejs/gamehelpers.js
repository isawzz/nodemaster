
//#region history layouts
function PRHLayout() {
	let drr = UI.DRR = mDiv(dTable);
	mAppend(drr, UI.dHistory);
	Clientdata.historyLayout = 'prh';
}
function HRPLayout() {
	let dr = UI.dRechts;
	dr.remove();
	let drr = UI.DRR = mDiv(dTable);
	mAppend(drr, UI.dHistory);
	mAppend(dTable, dr);
	Clientdata.historyLayout = 'hrp';
}
function PHLayout() {
	if (isdef(UI.DRR)) UI.DRR.remove();
	mAppend(UI.dRechts, UI.dHistory);
	Clientdata.historyLayout = 'ph';
}
function HPLayout() {
	if (isdef(UI.DRR)) UI.DRR.remove();
	mInsert(UI.dRechts, UI.dHistory);
	Clientdata.historyLayout = 'hp';
}
//#endregion

//#region misc output helpers
function sss() { show_playerdatastate(); }
function sss1() {
	let [fen, A, uplayer, plorder, data] = [Z.fen, Z.A, Z.uplayer, Z.plorder, Z.uplayer_data];
	let s = 'no data.state for player ' + uplayer;
	if (isDict(data.state)) {
		s = `${uplayer} passes `;
		for (const k in data.state.di) {
			s += `${k} ${data.state.di[k]}, `;
		}
	}
	console.log(s);
}
function show_playerdatastate() {
	for (const pldata of Z.playerdata) {
		console.log('player', pldata.name, `status=${isEmpty(pldata.player_status) ? 'none' : pldata.player_status}`, pldata.state);
	}
}
function shuffletest(list){
	for(let i=0; i<100; i++){
		shuffle(list);
		console.log('shuffle: ' + jsCopy(list));
	}
}

//#endregion

//#region title of page (in tab)
var WhichCorner = 0;
const CORNERS0 = ['♠', '♡']; //, '♣', '♢'];
const CORNERS = ['◢', '◣', '◤', '◥'];
const CORNERS2 = ['⬔', '⬕'];
const CORNERS3 = ['⮜', '⮝', '⮞', '⮟'];
const CORNERS4 = ['⭐', '⭑']; //, '⭒', '⭓'];
const CORNERS5 = ['⬛', '⬜']; //, '⭒', '⭓'];

function animatedTitle(msg = 'DU BIST DRAN!!!!!') {
	TO.titleInterval = setInterval(() => {
		let corner = CORNERS[WhichCorner++ % CORNERS.length];
		document.title = `${corner} ${msg}`; //'⌞&amp;21543;    U+231E \0xE2Fo\u0027o Bar';
	}, 1000);
}
function staticTitle() {
	clearInterval(TO.titleInterval);
	let url = window.location.href;
	let loc = url.includes('telecave') ? 'telecave' : 'local';
	// let game = isdef(Z) ? Config.games[Z.game].friendly : '♠ GAMES ♠'
	let game = isdef(Z) ? stringAfter(Z.friendly, 'of ') : '♠ GAMES ♠';
	document.title = `(${loc}) ${game}`; // DA.TEST0 == true? `poll: ${DA.pollCounter}` : `(${loc}) ${game}`; // ${DA.TEST0 == true ? DA.pollCounter : ''}`;
}
//#endregion title (tab)

//#region uname switching!!!!!!!!!!!!
function activate_playerstats(items) {
	//das ist manually!
	//console.log('activate_playerstats');
	//console.log('items', items); //return;
	let fen = Z.fen;
	for (const plname in fen.players) {
		let ui = items[plname];
		let d = iDiv(ui);
		d.onclick = () => { switch_uname(plname); onclick_reload(); }
	}
}
function if_hotseat_autoswitch(result){
	if (isdef(result.table) && isdef(Z) && Z.mode == 'hotseat'){ //!DA.AUTOSWITCH) {
		//DA.AUTOSWITCH = true;
		//hier sollte der automatische switch von uname passieren!!!
		let turn = lookup(result, ['table', 'fen', 'turn']);
		assertion(isdef(turn), 'turn is NOT defined (_sendSIMSIM) !!!!');
		//console.log('turn', turn, 'res', result)
		let uname = turn.length == 1 ? turn[0] : get_next_in_list(U.name, turn);
		//console.log('uname', uname);
		if (uname != U.name) switch_uname(uname);
	}
}
function switch_uname(plname) {
	set_user(plname);
	show_username();
	//DA.AUTOSWITCH = false;
}
//#endregion

function activate_ui() {

	if (uiActivated) { DA.ai_is_moving = false; return; }
	//console.log('______ activate_ui','\nprevturn',Clientdata.last_turn,'\n=>turn',Clientdata.this_turn,'\nprevstage',Clientdata.last_stage,'\n=>stage',Clientdata.this_stage);

	// if ((Clientdata.this_stage != Clientdata.last_stage || FirstLoad) && Clientdata.this_stage == 'card_selection') {
	// 	FirstLoad = false;
	// 	Clientdata.snapshot = jsCopy(Z.fen);
	// 	show('bRestartMove');
	// } else if (Clientdata.this_turn.length != 1) {
	// 	delete Clientdata.snapshot;
	// 	hide('bRestartMove');
	// }

	uiActivated = true; DA.ai_is_moving = false;
}
function animate_card_exchange(i0, i1, callback) {
	ari_make_unselectable(i0);
	ari_make_unselectable(i1);
	let d0 = iDiv(i0.o);
	let d1 = iDiv(i1.o);
	let r0 = getRect(d0);
	let r1 = getRect(d1);
	//get center of rectangles
	let c0 = { x: r0.x + r0.w / 2, y: r0.y + r0.h / 2 };
	let c1 = { x: r1.x + r1.w / 2, y: r1.y + r1.h / 2 };
	//get vector from c0 to c1
	let v = { x: c1.x - c0.x, y: c1.y - c0.y };
	mTranslateBy(d0, v.x, v.y);
	mTranslateBy(d1, -v.x, -v.y, 700, callback);
}
function animate_card_approx(card, goal, ms, callback) {
	let d = iDiv(card);
	let dgoal = iDiv(goal); //das muss irgendein UI item sein!
	let r = getRect(d);
	let rgoal = getRect(dgoal);
	let c = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
	let cgoal = { x: rgoal.x + rgoal.w / 2, y: rgoal.y + rgoal.h / 2 };
	let v = { x: cgoal.x - c.x, y: cgoal.y - c.y };
	mAnimateList(d, { transform: `translateX(${v.x}px) translateY(${v.y}px)`, opacity: 0 }, callback, ms, 'linear');

}
function animate_card_transfer(card, goal, callback) {
	let d = iDiv(card);
	let dgoal = iDiv(goal); //das muss irgendein UI item sein!
	let r = getRect(d);
	let rgoal = getRect(dgoal);
	let c = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
	let cgoal = { x: rgoal.x + rgoal.w / 2, y: rgoal.y + rgoal.h / 2 };
	let v = { x: cgoal.x - c.x, y: cgoal.y - c.y };
	mTranslateBy(d, v.x, v.y, 700, callback);
}
function animate_title() {
	var rev = "fwd";
	function titlebar(val) {
		var msg = "Hallodi!";
		var res = " ";
		var speed = 100;
		var pos = val;
		msg = "   |-" + msg + "-|";
		var le = msg.length;
		if (rev == "fwd") {
			if (pos < le) {
				pos = pos + 1;
				scroll = msg.substr(0, pos);
				document.title = scroll;
				timer = window.setTimeout("titlebar(" + pos + ")", speed);
			}
			else {
				rev = "bwd";
				timer = window.setTimeout("titlebar(" + pos + ")", speed);
			}
		}
		else {
			if (pos > 0) {
				pos = pos - 1;
				var ale = le - pos;
				scrol = msg.substr(ale, le);
				document.title = scrol;
				timer = window.setTimeout("titlebar(" + pos + ")", speed);
			}
			else {
				rev = "fwd";
				timer = window.setTimeout("titlebar(" + pos + ")", speed);
			}
		}
	}
	titlebar(0);

}
function beautify_history(lines, title, fen, uplayer) {

	//mach draus ein html
	//let [fen, uplayer] = [Z.fen, Z.uplayer];
	let html = `<div class="history"><span style="color:red;font-weight:bold;">${title}: </span>`;
	for (const l of lines) {
		let words = toWords(l);
		//console.log('words', words);
		for (const w1 of words) {
			if (is_card_key(w1)) {
				//html += ` ${ari_get_card(w1).friendly} `; 

				//html += `${w1[0]}<i class="fas fa-spade"></i>`;
				//let suit =  mCardText(w1).innerHTML;
				html += mCardText(w1);
				//console.log('suit', suit);
				continue;
			}
			w = w1.toLowerCase();
			if (isdef(fen.players[w])) {
				html += `<span style="color:${get_user_color(w)};font-weight:bold"> ${w} </span>`;
			} else html += ` ${w} `;
		}
	}
	html += "</div>";
	return html;
}
function deactivate_ui() { uiActivated = false; DA.ai_is_moving = true; }
function clear_status() { if (nundef(mBy('dStatus'))) return; clearTimeout(TO.fleeting); mRemove("dStatus"); }
//function clear_table() { clear_status(); clear_title(); mStyle(document.body, { bg: 'white', fg: '#111111' }) }
function clear_title() { mClear('dTitleMiddle'); mClear('dTitleLeft'); mClear('dTitleRight'); }
function collect_game_specific_options(game) {
	let poss = Config.games[game].options;
	if (nundef(poss)) return;
	let di = {};
	for (const p in poss) {
		let fs = mBy(`d_${p}`);
		//console.log('fs',fs, 'key',p);
		let val = get_checked_radios(fs)[0];
		di[p] = isNumber(val) ? Number(val) : val;
	}
	return di;
}
function compute_hidden(plname) {
	let [fen, uplayer] = [Z.fen, Z.uplayer];
	let pl = fen.players[plname];

	let hidden;
	if (isdef(fen.winners)) hidden = false;
	else if (Z.role == 'spectator') hidden = plname != uplayer;
	else if (Z.mode == 'hotseat') hidden = (pl.playmode == 'bot' || plname != uplayer);
	else hidden = plname != Z.uname;

	return hidden;

}
function delete_table(friendly) { stopgame(); phpPost({ friendly: friendly }, 'delete_table'); }
function ev_to_gname(ev) { evNoBubble(ev); return evToTargetAttribute(ev, 'gamename'); }
function find_card(index, ui_item) { return ui_item.items[index]; }
function generate_table_name(n) {
	let existing = Serverdata.tables.map(x => x.friendly);
	while (true) {
		let cap = rChoose(Info.capital);
		let parts = cap.split(' ');
		//console.log('parts', parts);
		if (parts.length == 2) cap = stringBefore(cap, ' '); else cap = stringBefore(cap, '-');
		cap = cap.trim();
		let s = (n == 2 ? 'duel of ' : rChoose(['battle of ', 'war of '])) + cap;
		//console.log('s', s);
		if (!existing.includes(s)) return s;
	}
}
function get_admin_player(list) {
	let res = valf(firstCond(list, x => x == 'mimi'), firstCond(list, x => ['felix', 'amanda', 'lauren'].includes(x)));
	return res ?? list[0]; //if (!res) return list[0];
}
function get_checked_radios(rg) {
	let inputs = rg.getElementsByTagName('INPUT');
	let list = [];
	for (const ch of inputs) {
		//console.log('child',ch)
		let checked = ch.getAttribute('checked');
		//console.log('is',checked);
		//console.log('?',ch.checked); 
		if (ch.checked) list.push(ch.value);
	}
	//console.log('list',list)
	return list;
}
function get_next_in_list(el, list) {
	let iturn = list.indexOf(el);
	let nextplayer = list[(iturn + 1) % list.length];
	return nextplayer;
}
function get_next_player(g, uname) {
	let plorder = g.fen.plorder;
	let iturn = plorder.indexOf(uname);
	let nextplayer = plorder[(iturn + 1) % plorder.length];
	return nextplayer;
}
function get_next_human_player(plname) {
	//console.log('==>find next_human_player after',plname);
	if (nundef(plname)) return null;
	let [prevturn, mode, turn, uname, plorder, fen, host] = [Z.prev.turn, Z.mode, Z.turn, Z.uname, Z.plorder, Z.fen, Z.host];
	let same = isString(plname) && isList(prevturn) && sameList(prevturn, turn);
	if (!same) return null;
	// let i=valf(fen.ihotseat,0);

	//log_object(Z,'hotseat player choice','prev turn plorder players');
	//console.log('prevturn', prevturn, 'turn', turn, 'same', same, 'plname', plname);
	let plnew = get_next_player(Z, plname);
	while (fen.players[plnew].playmode == 'bot') {
		plnew = get_next_player(Z, plnew);
		if (plnew == plname) break;
	}

	//console.log('next player should be',plnew);
	return plnew;
}
function get_present_order() {
	let [fen, uplayer, uname] = [Z.fen, Z.uplayer, Z.uname];
	let uname_plays = fen.plorder.includes(Z.uname);
	let show_first = uname_plays && Z.mode == 'multi' ? Z.uname : uplayer;
	return arrCycle(Z.fen.plorder, Z.fen.plorder.indexOf(show_first));
}
function get_waiting_html() { return `<img src="../base/assets/icons/active_player.gif" height="30" style="margin:0px 10px" />`; }
function get_waiting_html(sz = 30) { return `<img src="../base/assets/icons/active_player.gif" height="${sz}" style="margin:0px ${sz / 3}px" />`; }
function get_default_options(gamename) {
	let options = {};
	for (const k in Config.games[gamename].options) options[k] = arrLast(Config.games[gamename].options[k]);
	return options;
}
function get_logout_button() {
	let html = `<a id="aLogout" href="javascript:onclick_logout()">logout</a>`;
	return mCreateFrom(html);
}
function get_screen_distance(child, newParent) {
	child = toElem(child);
	newParent = toElem(newParent);

	const parentOriginal = child.parentNode;

	let children = arrChildren(parentOriginal);
	let iChild = children.indexOf(child);
	let sibling = iChild == children.length - 1 ? null : children[iChild + 1];

	const x0 = child.getBoundingClientRect().left;
	const y0 = child.getBoundingClientRect().top;
	//console.log('pos0', x0, y0)

	newParent.appendChild(child);
	const x1 = child.getBoundingClientRect().left;
	const y1 = child.getBoundingClientRect().top;
	//console.log('pos1', x1, y1)

	if (sibling) parentOriginal.insertBefore(child, sibling); else parentOriginal.appendChild(child);
	// child.style.setProperty('--dx', (x1 - x0) + 'px');
	// child.style.setProperty('--dy', (y1 - y0) + 'px');
	return [x1 - x0, y1 - y0];
}
function get_game_color(game) { return colorFrom(Config.games[game].color); }
function get_playmode(uname) { return Z.fen.players[uname].playmode; }
function get_img_html(path,styles,classes){
	let img = mImage(path, null, styles, classes);
	let x = img.outerHTML;
	//console.log('x',x)
	return img.outerHTML;
}
function get_user_color(uname) { let u = firstCond(Serverdata.users, x => x.name == uname); return colorFrom(u.color); }
function get_user_pic(uname, sz = 50, border = 'solid medium white') {
	let html = get_user_pic_html(uname, sz, border); 
	return mCreateFrom(html);
}
function get_user_pic_html(uname, sz = 50, border = 'solid medium white') {
	return `<img src='../base/assets/users/${uname}.jpg' width='${sz}' height='${sz}' class='img_person' style='margin:0px 4px;border:${border}'>`
	//return mCreateFrom(html);
}
function get_user_pic_and_name(uname, dParent, sz = 50, border = 'solid medium white') {
	let html = `
			<div username='${uname}' style='text-align:center;font-size:${sz / 2.8}px'>
				<img src='../base/assets/users/${uname}.jpg' width='${sz}' height='${sz}' class='img_person' style='margin:0;border:${border}'>
				<div style='margin-top:${-sz / 6}px'>${uname}</div>
			</div>`;
	let elem = mCreateFrom(html);
	mAppend(dParent, elem);
	return elem;
}
function get_texture(name) { return `url(../base/assets/textures/${name}.png)`; }
function hide_buildings() {
	//console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLLLOOOOOOOOOOOOOO')
	let uplayer = Z.uplayer;
	let buildings = UI.players[uplayer].buildinglist;
	for (const b of buildings) {
		//console.log('b.schweine', b.schweine);
		for (let i = 1; i < b.items.length; i++) {
			let card = b.items[i];
			if (b.schweine.includes(card)) continue;
			face_down(b.items[i]);
		}
	}
}
function hFunc(content, funcname, arg1, arg2, arg3) {
	//console.log('arg2',arg2,typeof arg2)
	let html = `<a style='color:blue' href="javascript:${funcname}('${arg1}','${arg2}','${arg3}');">${content}</a>`;
	return html;
}
function i_am_host() { return U.name == Z.host; }
function i_am_acting_host() { return U.name == Z.fen.acting_host; }
function i_am_trigger() { return is_multi_trigger(U.name); }
function is_advanced_user() {
	let advancedUsers = ['mimi', 'bob', 'buddy', 'minnow', 'nimble', 'leo']; //, 'guest', 'felix'];
	//console.log('U', isdef(U) ? U.name : 'undefined!!!', 'secret:', DA.secretuser);
	return isdef(U) && ((advancedUsers.includes(DA.secretuser) || advancedUsers.includes(U.name)));

}
function is_collect_mode() { return Z.turn.length > 1; }
function is_just_my_turn() {
	return isEmpty(Z.turn.filter(x => x != Z.uplayer));
}
function get_multi_trigger() { return lookup(Z, ['fen', 'trigger']); }
function is_multi_trigger(plname) { return lookup(Z, ['fen', 'trigger']) == plname; }
function is_multi_stage() { return isdef(Z.fen.trigger); }
function is_playerdata_set(plname) {
	return isdef(Z.playerdata) && !isEmpty(Z.playerdata) && !isEmpty(Z.playerdata.find(x => x.name == plname).state);
}
function is_playing(pl, fen) {
	//returns true is pl is in fen.plorder or in fen.roundorder
	return isList(fen.plorder) && fen.plorder.includes(pl) || isList(fen.roundorder) && fen.roundorder.includes(pl) || Z.game == 'feedback' && isdef(Z.fen.players[pl]);
}
function is_shield_mode() {
	return Z.role == 'spectator'
		|| Z.mode == 'multi' && Z.role == 'inactive' && Z.host != Z.uname
		|| Z.mode == 'multi' && Z.role == 'inactive' && Z.pl.playmode != 'bot'
}
function path2fen(fen, path) { let o = lookup(fen, path.split('.')); return o; }
function path2UI(path) {
	let res = lookup(UI, path.split('.'));
	//console.log('res',res);
	return res;
}
function player_stat_count(key, n, dParent, styles = {}) {
	let sz = valf(styles.sz, 16);
	//console.log('hallo!!!')

	//if (nundef(styles.wmax)) styles.wmax = sz;
	addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'start', fz: sz, align: 'center' }, styles);

	let d = mDiv(dParent, styles);
	if (isdef(Syms[key])) mSym(key, d, { h: sz, 'line-height': sz, w: '100%' });
	else mText(key, d, { h: sz, fz: sz, w: '100%' });
	d.innerHTML += `<span style="font-weight:bold">${n}</span>`;
	return d;
}
function new_cards_animation(n = 2) {
	let [stage, A, fen, plorder, uplayer, deck] = [Z.stage, Z.A, Z.fen, Z.plorder, Z.uplayer, Z.deck];
	let pl = fen.players[uplayer];
	if (stage == 'card_selection' && !isEmpty(pl.newcards)) {
		let anim_elems = [];

		//console.log('player', uplayer, 'newcards', jsCopy(pl.newcards));
		for (const key of pl.newcards) {
			let ui = lastCond(UI.players[uplayer].hand.items, x => x.key == key);
			if (nundef(ui)) {pl.newcards=[];return;}
			ui = iDiv(ui);
			anim_elems.push(ui);
		}
		delete pl.newcards;
		//console.log('player', uplayer, 'newcards deleted:', pl.newcards);

		//animate newcards!
		anim_elems.map(x => mPulse(x, n * 1000));
		// setTimeout(ferro_pre_action,1000);
	}
}
function round_change_animation(n = 2) {
	let [stage, A, fen, plorder, uplayer, deck] = [Z.stage, Z.A, Z.fen, Z.plorder, Z.uplayer, Z.deck];
	let pl = fen.players[uplayer];
	if (pl.roundchange) {
		let d = mBy('dTitleLeft');
		mStyle(d, { 'transform-origin': '0% 0%' });
		mPulse(d, n * 1000);
		show_special_message(`${fen.round_winner} won round ${Z.round - 1}!!!`)
		delete pl.roundchange;
	}
}
function remove_player(fen, uname) {
	if (nundef(fen.original_players)) fen.original_players = jsCopy(fen.players);
	removeInPlace(fen.plorder, uname);
	delete fen.players[uname];
	return fen.plorder;
}
function remove_hourglass(uname) { let d = mBy(`dh_${uname}`); if (isdef(d)) mRemove(d); }
function set_user(name) {
	if (isdef(Z) && isdef(U) && U.name != name) {
		Z.prev.u = U;
		Z.prev.uname = U.name;
	}
	U = firstCond(Serverdata.users, x => x.name == name);
	//console.log('set_user', name, U);
	if (isdef(Z)){
		Z.u = U;
		Z.uname = Z.uplayer = name;
		//console.log('Z.uname', Z.uname);
	
	}
}
function set_player(name, fen) {
	if (isdef(PL) && PL.name != name) { Z.prev.pl = PL; Z.prev.uplayer = PL.name; }
	PL = Z.pl = firstCond(Serverdata.users, x => x.name == name);
	//console.log('name',name);
	copyKeys(fen.players[name], PL);
	Z.uplayer = name;
}
function set_player_strategy(val) {
	Z.strategy = Clientdata.strategy = Z.pl.strategy = val;
	mRemove('dOptions')


}
function shield_on() {
	mShield(dTable.firstChild.childNodes[1]);
	mStyle('dAdmin', { bg: 'silver' });
}
function shield_off() {
	mStyle('dAdmin', { bg: 'white' });

}
function show_admin_ui() {
	//console.log('show_admin_ui');
	//game specific buttons hide or show
	for (const id of ['bSpotitStart', 'bClearAck', 'bRandomMove', 'bSkipPlayer', 'bRestartMove']) hide(id);
	if (Z.game == 'spotit' && Z.uname == Z.host && Z.stage == 'init') show('bSpotitStart');
	else if (Z.game == 'bluff' && Z.uname == Z.host && Z.stage == 1) show('bClearAck');
	else if (Z.uname == Z.host && Z.stage == 'round_end') show('bClearAck');
	else if (Z.game == 'ferro' && Z.uname == 'mimi' && Z.stage != 'card_selection') show('bClearAck');

	if (['ferro', 'bluff', 'aristo', 'a_game'].includes(Z.game) && (Z.role == 'active' || Z.mode == 'hotseat')) {
		//console.log('random should show because game is', Z.game)
		show('bRandomMove');
	}
	if (Z.uname == Z.host || Z.uname == 'mimi') show('dHostButtons'); else hide('dHostButtons');
	if (DA.TEST0 == true) show('dTestButtons'); else hide('dTestButtons');
}
function show_fleeting_message(s, dParent, styles, id, ms = 2000) {
	let d = mDiv(dParent, styles, id, s);
	mFadeRemove(d, ms);
}
function show_games(ms = 500) {

	let dParent = mBy('dGames');
	mClear(dParent);
	mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });

	let d = mDiv(dParent, { fg: 'white', animation: 'appear 1s ease both' }, 'game_menu'); mFlexWrap(d);
	let gamelist = 'aristo bluff spotit ferro fritz'; if (DA.TEST0) gamelist += ' a_game';
	for (const g of dict2list(Config.games)) {
		if (gamelist.includes(g.id)) {
			let [sym, bg, color, id] = [Syms[g.logo], g.color, null, getUID()];
			let d1 = mDiv(d, { cursor: 'pointer', rounding: 10, margin: 10, padding: 0, patop: 15, wmin: 140, height: 90, bg: bg, position: 'relative' }, g.id);
			d1.setAttribute('gamename', g.id);
			d1.onclick = onclick_game_menu_item;
			mCenterFlex(d1);
			mDiv(d1, { fz: 50, family: sym.family, 'line-height': 55 }, null, sym.text);
			mLinebreak(d1);
			mDiv(d1, { fz: 18, align: 'center' }, null, g.friendly);
		}
	}
}
function show_game_options(dParent, game) {
	mRemoveChildrenFromIndex(dParent, 2);
	let poss = Config.games[game].options;
	if (nundef(poss)) return;
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(','); // make a list 
			let fs = mRadioGroup(dParent, {}, `d_${key}`, key);
			//let func = pool=='mode'?adjust_playmodes:null;
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
			measure_fieldset(fs);
		}
	}

}
function show_player_button(caption, ui_item, handler) {
	let d = ui_item.container ?? iDiv(ui_item);
	//console.log('d', d);
	let styles = { rounding: 6, bg: 'silver', fg: 'black', border: 0, maleft: 10 };
	let b = mButton(caption, handler, d, styles, 'enabled');
	return b;
}
function show_handsorting_buttons_for(plname, styles = {}) {
	if (Z.role == 'spectator' || isdef(mBy('dHandButtons'))) return;

	let fen = Z.fen;
	let pl = fen.players[plname];
	if (pl.hand.length <= 1) return;

	let d = UI.players[plname].hand.container; mStyle(d, { position: 'relative', wmin: 155 }); //,bg:'green' });
	addKeys({ position: 'absolute', left: 58, bottom: -8, height: 25 }, styles);
	let dHandButtons = mDiv(d, styles, 'dHandButtons');

	show_player_button('rank', dHandButtons, onclick_by_rank);
	show_player_button('suit', dHandButtons, onclick_by_suit);
}
function ari_show_handsorting_buttons_for(plname) {
	if (Z.role == 'spectator' || isdef(mBy('dHandButtons'))) return;

	let fen = Z.fen;
	let pl = fen.players[plname];

	if (pl.hand.length <= 1) return;

	let d = UI.players[plname].hand.container; mStyle(d, { position: 'relative' });
	let dHandButtons = mDiv(d, { position: 'absolute', bottom: -2, left: 52, height: 25 }, 'dHandButtons');
	show_player_button('sort', dHandButtons, onclick_by_rank);

}
function show_view_buildings_button(plname) {
	if (Z.role == 'spectator' || isdef(mBy('dPlayerButtons'))) return;

	//let fen = Z.fen;
	//let pl = fen.players[plname];
	//console.log('buildings empty',isEmpty(UI.players[plname].buildinglist));
	if (isEmpty(UI.players[plname].buildinglist)) return;

	//let d = mBy(`d_${plname}`); mStyle(d,{bg:'red'});
	let d1 = iDiv(UI.players[plname]); mStyle(d1, { position: 'relative' });
	let d2 = mDiv(d1, { position: 'absolute', top: 8, left: 50, height: 25 }, 'dPlayerButtons');
	//mStyle(d,{position:'relative'});
	//let dPlayerButtons = mDiv(d, { position: 'absolute', top: 8, left: 52, height: 25, width: 200, bg:'green' }, 'dPlayerButtons');
	show_player_button('view buildings', d2, onclick_view_buildings);

} 
function show_history(fen, dParent) {
	if (!isEmpty(fen.history)) {
		let html = '';
		for (const o of jsCopy(fen.history).reverse()) {
			//console.log('o', o);
			html += beautify_history(o.lines, o.title, fen);
			//html += o;//html+=`<h1>${k}</h1>`;
			//for (const line of arr) { html += `<p>${line}</p>`; }
		}
		// let dHistory =  mDiv(dParent, { padding: 6, margin: 4, bg: '#ffffff80', fg: 'black', hmax: 400, 'overflow-y': 'auto', wmin: 240, rounding: 12 }, null, html); //JSON.stringify(fen.history));
		let dHistory = mDiv(dParent, { paleft: 12, bg: colorLight('#EDC690', .5), box: true, matop: 4, rounding: 10, patop: 10, pabottom: 10, w: '100%', hmax: `calc( 100vh - 250px )`, 'overflow-y': 'auto', w: 260 }, null, html); //JSON.stringify(fen.history));
		// let dHistory =  mDiv(dParent, { padding: 6, margin: 4, bg: '#ffffff80', fg: 'black', hmax: 400, 'overflow-y': 'auto', wmin: 240, rounding: 12 }, null, html); //JSON.stringify(fen.history));
		//mNode(fen.history, dHistory, 'history');
		UI.dHistoryParent = dParent;
		UI.dHistory = dHistory;
		//console.log('dHistory', dHistory);


		if (isdef(Clientdata.historyLayout)) {
			show_history_layout(Clientdata.historyLayout);
		}
	}

}
function show_history_layout(layout) {
	assertion(isdef(UI.dHistoryParent) && isdef(UI.dHistory), 'UI.dHistoryParent && UI.dHistory do NOT exist!!!');
	if (layout == 'ph') PHLayout();
	else if (layout == 'hp') HPLayout();
	else if (layout == 'prh') PRHLayout();
	else if (layout == 'hrp') HRPLayout();
	else PHLayout();
}
function show_history_popup() {

	if (isEmpty(Z.fen.history)) return;
	assertion(isdef(UI.dHistoryParent) && isdef(UI.dHistory), 'UI.dHistoryParent && UI.dHistory do NOT exist!!!');

	let l = valf(Clientdata.historyLayout, 'ph');
	let cycle = ['ph', 'hp', 'prh', 'hrp'];
	let i = (cycle.indexOf(l) + 1) % cycle.length;

	show_history_layout(cycle[i]);



}
function show_home_logo() {
	let bg = colorLight();
	let dParent = mBy('dAdminLeft');
	clearElement(dParent);
	let d = miPic('castle', dParent, { cursor: 'pointer', fz: 24, padding: 6, h: 36, box: true, margin: 2 }); //, bg: bg, rounding: '50%' });
	d.onclick = onclick_home;
	let version = 'v0.0.1';
	let html = `version ${version}`
	mText(html, dParent, { fz: 12 });
}
function show_hourglass(uname, d, sz, stylesPos = {}) {
	let html = get_waiting_html(sz);
	mStyle(d, { position: 'relative' });
	addKeys({ position: 'absolute' }, stylesPos);
	let dw = mDiv(d, stylesPos, `dh_${uname}`, html);

}
function show_instruction(msg) { mBy('dSelections0').innerHTML = msg; }

function show_MMM(msg) { show_fleeting_message(msg, mBy('dMMM')); }

function show_message(msg = '', stay = false) {
	mStyle(dTable, { transition: 'all 1s ease' });
	let d = mBy('dMessage'); d.innerHTML = msg;
	if (stay) return;
	let ms = 1000, delay = 3000;
	let anim = d.animate([{ transform: `scale(1,1)`, opacity: 1 }, { transform: `scale(1,0)`, opacity: 0 },], { duration: 1000, easing: 'ease', delay: delay });
	dTable.animate([{ transform: 'translateY(0px)' }, { transform: 'translateY(-56px)' },], { fill: 'none', duration: ms, easing: 'ease', delay: delay });
	anim.onfinish = () => {
		mClear(d);
	}
}
function show_options_popup(options) {
	let opresent = {};
	let di = { mode: 'gamemode', yes: true, no: false };
	let keys = get_keys(options);
	keys.sort();
	for (const k of get_keys(options).sort()) {
		let key = valf(di[k], k);
		let val = valf(di[options[k]], options[k]);
		opresent[key] = val;
	}
	//moechte dass er statt mode
	let x = mYaml(mCreate('div'), opresent);
	let dpop = mPopup(x.innerHTML, dTable, { fz: 16, fg: 'white', top: 0, right: 0, border: 'white', padding: 10, bg: 'dimgray' }, 'dOptions');
	mInsert(dpop, mCreateFrom(`<div style="text-align:center;width:100%;font-family:Algerian;font-size:22px;">${Z.game}</div>`));
	//console.log('popup', dpop);
}
function show_polling_signal() {
	if (DA.TEST0 != true) return;
	let d1 = mDiv(mBy('dAdmin'), { position: 'fixed', top: 10, left: 73 });
	let bg = Z.skip_presentation == true ? 'grey' : 'green'; //valf(DA.reloadColor, 'green')
	let d2 = mDiv(d1, { width: 20, height: 20, bg: bg, rounding: 10, display: 'inline-block' });
	//let d3 = mDiv(d1, { display: 'inline-block' }, null, Z.skip_presentation==true ? 'SKIP' : 'REDRAW');
	mFadeRemove(d1, 1000);


}
function show_role() {

	let d = mBy('dAdminMiddle');
	clearElement(d);
	let hotseatplayer = Z.uname != Z.uplayer && Z.mode == 'hotseat' && Z.host == Z.uname;

	let styles, text;
	let boldstyle = { fg: 'red', weight: 'bold', fz: 20 };
	let normalstyle = { fg: 'black', weight: null, fz: null };
	let location = ''; //`<span style="color:dimgray;font-family:Algerian">${Z.friendly}  </span>`; // `in ${stringAfter(Z.friendly,'of ')}`;
	if (hotseatplayer) {
		styles = boldstyle;
		text = `your turn for ${Z.uplayer}`;
		// text = `your turn for ${Z.uplayer} ${location}`;
	} else if (Z.role == 'spectator') {
		styles = normalstyle;
		text = `(spectating)`;
		//text = `(spectating  ${location})`;
	} else if (Z.role == 'active') {
		styles = boldstyle;
		text = `It's your turn!!!`;
		//text = `It's your turn  ${location}!`;
	} else if (Z.role == 'waiting') {
		text = `waiting for players to complete their moves...`;
		//text = `waiting for players to complete their moves ${location}...`;
	} else {
		assertion(Z.role == 'inactive', 'role is not active or inactive or spectating ' + Z.role);
		styles = normalstyle;
		text = `(${Z.turn[0]}'s turn)`;
		//text = `(${Z.turn[0]}'s turn ${location})`;
	}

	// let styles = Z.role == 'active' || hotseatplayer ? { fg: 'red', weight: 'bold', fz: 20 } : { fg: 'black', weight: null, fz: null };
	// let text = hotseatplayer ? `you turn for ${Z.uplayer}` : Z.role == 'active' ? `It's your turn!` : Z.role == 'spectator' ? "(spectating)" : `(${Z.turn[0]}'s turn)`;
	d.innerHTML = location + text;
	mStyle(d, styles);
}
function show_settings(dParent) {
	let [options, fen, uplayer] = [Z.options, Z.fen, Z.uplayer];
	clearElement(dParent);
	mFlex(dParent);
	mStyle(dParent, { 'justify-content': 'end', gap: 12, paright: 10 })
	//console.log('dParent', dParent)
	let playmode = get_playmode(uplayer); //console.log('playmode',playmode,'uplayer',uplayer);
	let game_mode = Z.mode;
	// let dplaymode = mDiv(dParent, { fg: 'blue' }, null, playmode); // playmode == 'bot' ? 'bot' : '');
	// let dgamemode = mDiv(dParent, { fg: 'red' }, null, Z.mode); //Z.mode == 'hotseat' ? 'h' : '');
	// let st = { fz: 20, padding: 6, h: 40, box: true, matop: 2, rounding: '50%', cursor: 'pointer' };
	let st = { fz: 20, padding: 0, h: 40, box: true, matop: 2, rounding: '50%', cursor: 'pointer' };
	let dHistoryButton = miPic('scroll', dParent, st);
	dHistoryButton.onclick = show_history_popup;

	if (isdef(Config.games[Z.game].options.strategy)) {
		let dStrategy = miPic('chess pawn', dParent, st);
		dStrategy.onclick = show_strategy_popup;
	}

	let d = miPic('gear', dParent, st);
	options.playmode = playmode;
	d.onmouseenter = () => show_options_popup(options);
	d.onmouseleave = hide_options_popup;


	//dHistoryButton.onmouseleave = hide_options_popup;
}
function show_stage() {
	if (isdef(Z.fen.progress)) {
		let d = mBy('dTitleLeft');
		let former = mBy('dProgress');
		if (isdef(former)) former.remove();
		let dprogress = mDiv(d, {}, 'dProgress', `<div>${Z.fen.progress}</div>`);
	}
}
function show_status(s) {

	//console.log('........show_status', s)
	if (is_advanced_user()) {
		clear_status();
		if (!TESTING && !s.includes('reload')) show_fleeting_message(s, 'dTest', { fz: 14, position: 'absolute', top: 5, right: 10 }, 'dStatus');
	}
}
function show_strategy_popup() {
	//console.log('options', options);
	let dpop = mPopup('', dTable, { fz: 16, fg: 'white', top: 0, right: 0, border: 'white', padding: 10, bg: 'dimgray' }, 'dOptions');
	mAppend(dpop, mCreateFrom(`<div style="text-align:center;width:100%;font-family:Algerian;font-size:22px;">${Z.game}</div>`));
	mDiv(dpop, { matop: 5, maleft: 10 }, null, `choose strategy:`);

	let vals = Config.games[Z.game].options.strategy.split(',');
	//console.log('vals', vals);
	let key = 'strategy';
	let fs = mRadioGroup(dpop, { fg: 'white' }, `d_${key}`); //,`${key}`, {fg:'white',border:'1px solid red'});
	for (const v of vals) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, set_player_strategy, key, v == Z.strategy); }
	measure_fieldset(fs);

	//UI.dStrategyContent = mTextArea(10, 20, dpop, { margin: 10, padding: 10 }, 'dStrategyContent');

	//console.log('popup', dpop);
}
function show_tables(ms = 500) {

	clear_screen();
	let dParent = mBy('dTables');
	mClear(dParent);

	show_games();

	let tables = Serverdata.tables;
	if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }

	tables.map(x => x.game_friendly = Config.games[x.game].friendly);
	mText(`<h2>game tables</h2>`, dParent, { maleft: 12 })
	let t = mDataTable(tables, dParent, null, ['friendly', 'game_friendly', 'players'], 'tables', false);

	mTableCommandify(t.rowitems, {
		0: (item, val) => hFunc(val, 'onclick_table', val, item.id),
	});


	//delete command:
	let d = iDiv(t);
	//let x = mAppend(d.firstChild.firstChild, mCreate('th')); x.innerHTML = 'commands'; //header! console.log('x', x);
	for (const ri of t.rowitems) {
		let r = iDiv(ri);
		let h = hFunc('delete', 'delete_table', ri.o.friendly);
		c = mAppend(r, mCreate('td'));
		c.innerHTML = h;
	}


	//mRise(dParent, ms);
	//mRise('dScreen', 1000); 
}
function show_title() {
	//mBy('dTitleMiddle').innerHTML = Z.friendly;
	Z.func.state_info(mBy('dTitleLeft'));
	show_settings(mBy('dTitleRight'));
	mBy('dTablename').innerHTML = Z.friendly;
}
function show_username() {
	let uname = U.name;
	let dpic = get_user_pic(uname, 30);
	let d = mBy('dAdminRight');
	mClear(d);
	mAppend(d, get_logout_button());
	mAppend(d, dpic);

	if (is_advanced_user()) { show('dAdvanced1'); } else { hide('dAdvanced'); hide('dAdvanced1'); }
	//if (TESTING) show('dAdvanced');

	//console.log('DA.running',DA.running); //'Z',Z,'dTable',dTable,mBy('dTable'),isVisible('dTable'));

	if (!TESTING && !DA.running) phpPost({ app: 'easy' }, 'tables'); //else console.log('no tables cmd! DA.running', DA.running);
}
function show_users(ms = 300) {
	let dParent = mBy('dUsers');
	mClear(dParent);

	//mStyle(dParent, { gap: 10, padding: 10 });
	for (const u of Serverdata.users) {
		if (['ally', 'bob', 'leo'].includes(u.name)) continue;
		//console.log('u',u)
		let d = get_user_pic_and_name(u.name, dParent);
		d.onclick = () => onclick_user(u.name);
		mStyle(d, { cursor: 'pointer' });
	}
	mFall(dParent, ms);
}
function show_waiting_for_ack_message() {
	let dInstruction = mBy('dSelections0');
	mClass(dInstruction, 'instruction');
	mCenterCenterFlex(dInstruction);
	mBy('dSelections0').innerHTML = 'waiting for next round to start...'; //.remove();
}
function show_waiting_message(msg) {
	let dInstruction = mBy('dSelections0');
	mClass(dInstruction, 'instruction');
	mCenterCenterFlex(dInstruction);
	mBy('dSelections0').innerHTML = msg;
}
function show_winners() {
	let winners = Z.fen.winners;
	//winners = ['felix','amanda'];
	let multiple_winners = winners.length > 1;
	let winners_html = winners.map(x => get_user_pic_html(x, 35)).join(' ');
	let msg = `
		<div style="display:flex;gap:10px;align-items:center">
			<div style="color:red;font-size:22px;font-weight:bold;">GAME OVER! the winner${multiple_winners ? 's are: ' : ' is '}</div>
			<div style="padding-top:5px;">${winners_html}</div>
		</div>
	`;
	show_message(msg, true);
	//mStyle(d,{fg:'red',weight:'bold',fz:24})
	mShield(dTable);
	hide('bRestartMove');

	return Z.fen.winners;
}
function status_message_new(msg, dParent, styles = {}) {
}
function tableLayoutMR(dParent, m = 7, r = 1) {
	let ui = UI; ui.players = {};
	clearElement(dParent);
	let bg = 'transparent';
	let [dMiddle, dRechts] = [ui.dMiddle, ui.dRechts] = mColFlex(dParent, [m, r], [bg, bg]);
	mCenterFlex(dMiddle, false); //no horizontal centering!
	let dOben = ui.dOben = mDiv(dMiddle, { w: '100%', display: 'block' }, 'dOben');
	let dSelections = ui.dSelections = mDiv(dOben, {}, 'dSelections');
	for (let i = 0; i <= 5; i++) { ui[`dSelections${i}`] = mDiv(dSelections, {}, `dSelections${i}`); }
	let dActions = ui.dActions = mDiv(dOben, { w: '100%' });
	for (let i = 0; i <= 5; i++) { ui[`dActions${i}`] = mDiv(dActions, { w: '100%' }, `dActions${i}`); }
	ui.dError = mDiv(dOben, { w: '100%', bg: 'red', fg: 'yellow', hpadding: 12, box: true }, 'dError');
	let dSubmitOrRestart = ui.dSubmitOrRestart = mDiv(dOben, { w: '100%' });
	let dOpenTable = ui.dOpenTable = mDiv(dMiddle, { w: '100%', padding: 10 }); mFlexWrap(dOpenTable);// mLinebreak(d_table);
	return [dOben, dOpenTable, dMiddle, dRechts];
}
function ui_player_info(dParent, outerStyles = { dir: 'column' }, innerStyles = {}) {
	let fen = Z.fen;
	// let players = dict2list(fen.players, 'name');
	// players = sortByFunc(players, x => fen.plorder.indexOf(x.name));
	if (nundef(outerStyles.display)) outerStyles.display = 'flex';
	mStyle(dParent, outerStyles);

	let items = {};
	let styles = jsCopy(innerStyles); addKeys({ rounding: 10, bg: '#00000050', margin: 4, padding: 4, patop: 12, box: true, 'border-style': 'solid', 'border-width': 6 }, styles);
	let order = get_present_order();
	//console.log('order', order);
	for (const plname of order) {
		let pl = fen.players[plname];
		let uname = pl.name;
		let imgPath = `../base/assets/users/${uname}.jpg`;
		styles['border-color'] = get_user_color(uname);
		let item = mDivItem(dParent, styles, name2id(uname));
		let d = iDiv(item);

		//let bc=pl.playmode == 'bot'?'red':'white';
		let picstyle = { w: 50, h: 50, box: true };
		let ucolor = get_user_color(uname);
		if (pl.playmode == 'bot') {
			copyKeys({ rounding: 0, border: `double 6px ${ucolor}` }, picstyle);
		} else {
			copyKeys({ rounding: '50%', border: `solid 2px white` }, picstyle);
		}
		let img = mImage(imgPath, d, picstyle, 'img_person');

		// let d1=mDiv(d,{w: 50, h: 50});
		// if (pl.playmode == 'bot') {
		// 	//console.log('d', d, d.children[0]); let img = d.children[0];
		// 	let d2 = mText('B', d1, { fg: 'red', fz: 20, position:'absolute',top:'50%',left:'50%'});
		// 	//mPlace(d2, 'cc');
		// }


		items[uname] = item;
	}
	if (DA.SIMSIM || is_advanced_user()) activate_playerstats(items)

	return items;
}







