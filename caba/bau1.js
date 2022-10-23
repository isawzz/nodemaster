
function autocomplete(inp, arr) {
	/* inp...input element, arr...array of possible autocompleted values:*/
	var currentFocus;
	inp.addEventListener('input', function (e) { /*execute a function when someone writes in the text field:*/
		var a, b, i, val = this.value;		/*close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) { return false; }
		currentFocus = -1;
		a = document.createElement('DIV'); /*create a DIV element that will contain the items (values):*/
		a.setAttribute('id', this.id + 'autocomplete-list');
		a.setAttribute('class', 'autocomplete-items');
		this.parentNode.appendChild(a); /*append the DIV element as a child of the autocomplete container:*/
		for (i = 0; i < arr.length; i++) {
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				b = document.createElement('DIV'); /*create a DIV element for each matching element:*/
				b.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>'; /*make the matching letters bold:*/
				b.innerHTML += arr[i].substr(val.length);
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>"; /*insert a input field that will hold the current array item's value:*/
				b.addEventListener('click', function (e) {
					inp.value = this.getElementsByTagName('input')[0].value; /*insert the value for the autocomplete text field:*/
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	inp.addEventListener('keydown', function (e) {
		var x = document.getElementById(this.id + 'autocomplete-list');
		if (x) x = x.getElementsByTagName('div');
		if (e.keyCode == 40) { // arrow DOWN
			currentFocus++;
			addActive(x);
		} else if (e.keyCode == 38) { //arrow UP
			currentFocus--;
			addActive(x);
		} else if (e.keyCode == 13) { // ENTER
			e.preventDefault();  // if the ENTER key is pressed, prevent the form from being submitted
			if (currentFocus > -1) {
				if (x) x[currentFocus].click(); // simulate a click on the "active" item:
			}
		}
	});
	function addActive(x) {
		// works with classes from styles.css
		if (!x) return false;
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = x.length - 1;
		x[currentFocus].classList.add('autocomplete-active');
	}
	function removeActive(x) {
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove('autocomplete-active');
		}
	}
	function closeAllLists(elmnt) {
		var x = document.getElementsByClassName('autocomplete-items');
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}

	document.addEventListener('click', function (e) {
		closeAllLists(e.target);
	});
}
















