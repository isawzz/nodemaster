
function mAutocomplete(dParent) {
	let form = mCreateFrom(`
		<form class='form' autocomplete="off" action="javascript:void(0);">
			<input id="myInput" type="text" name="myCountry" placeholder="City" />
			<input type="submit" value="Go!" />
		</form>
	`	);
	form.onsubmit=dummy_reaction; //das funktioniert!!! YEAH!!!
	let d=mAppend(dParent, form);
	console.log('cities',get_keys(Geo.cities));
	return;
	autocomplete(d.firstChild,get_keys(Geo.cities));
}






















