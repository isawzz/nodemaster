


function test5() {
	norm = new normalDistribution(0, 1);
	norm.printPdf('', 'less');
	norm.printMoments();


	norm = new normalDistribution(eval(this.form.mu.value), eval(this.form.si.value));
	if (!isNaN(eval(this.form.si.value))) {
		norm.printPdf(eval(this.form.x.value), this.form.mydropdown.value);
		norm.printMoments();
	};

	this.form.p.value = roundNumber(norm.cdf(eval(this.form.x.value)), 5);

	google.charts.load('current', {packages: ['corechart']});


}

function roundNumber(x,n){return x.toFixed(n);}

function g4(x, mean, stdev) {
	let variance = stdev * stdev;
	var y = mean / Math.E ** (((x) ** 2) / (2 * variance)); return y;
}
function g5(x, mean, stdev) {
	x = (x - mean) / stdev;
	return Math.pow(Math.E, -Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
}
function g6(x, mean, stdev) {
	x = (x - mean) / stdev;
	return Math.E ** (-(x ** 2) / 2) / Math.sqrt(2 * Math.PI);
}
function g7(x, mean, stdev) {
	x = (x - mean); let v = stdev * stdev;
	return Math.E ** (-(x ** 2) / (2 * v)) / Math.sqrt(v * 2 * Math.PI);
}
function g8(x, mean, stdev) {
	const dividend = Math.E ** -((x - mean) ** 2 / (2 * stdev ** 2));
	const divisor = stdev * Math.sqrt(2 * Math.PI); return dividend / divisor;
}
function g9(x, mean, stdev) {
	let f = new Gaussian(mean, stdev ** 2);
	console.log('f', f)
	return f.pdf(x);
}

function test4() {
	console.log(gauss(100, 100, 15));
	console.log(formula0(100, 100, 15));
	console.log(normalcdf(100, 100, 15)); //ja das ist cdf!
	console.log('g4', g4(100, 100, 15));
	console.log('g5', g5(100, 100, 15));
	console.log('g6', g6(100, 100, 15));
	console.log('g7', g7(100, 100, 15));
	console.log('g8', g8(100, 100, 15));
	//console.log('g9', g9(100, 100, 15));
}
function test3_cdf() {
	// let y; let [mean,stdev]=[100,15];
	// y=cdfNormal(85,mean,stdev); console.log('y',y); 
	// y=cdfNormal(100,mean,stdev); console.log('y',y); 
	// y=cdfNormal(115,mean,stdev)-y; console.log('y',y*2); 
	// return;
	y = cumulative_distribution(85, 115, 100, 15);
	y = cumulative_distribution(105, 115, 100, 15);

	return;
	console.log('y', y); return;
	for (let x = 0; x <= 150; x += 25) {
		let y = cdf0(x);
		console.log('x', x, 'y', y)
	}
}
function test2_nerd() {
	//You can interact with the parser directly by getting the core
	//with nerdamer loaded either in a web page or node.js
	var core = nerdamer.getCore();
	//the parser can be accessed in the core through PARSER. 
	//Make a shortcut using underscore
	var _ = core.PARSER;
	//when parsing the function first looks into the built-in Math object
	//and then into the Math2 object
	//add a custom function
	//core.Math2.custom = function (a, b) { return (2 * a + b) / a; };
	core.Math2.custom = function (x) { return (100 * formula1(x)).toFixed(4); };
	//let nerdamer know that it's ok to access this function
	//we do that using an array. The first parameter is the special handler
	//which we'll leave blank for now. This will only give it numeric capabilities
	_.functions.custom = [, 1];
	//we can now use the function
	var x = nerdamer('custom(140)').evaluate();
	console.log(x.toString()); //5
	//return custom;
	let fi = nerdamer(`integrate(custom(x),x)`).buildFunction();
	let y = fi(100);
	console.log('fi(100)', y)
}
function test1_nerd() {
	test0_nerd();

	let fi = nerdamer(`integrate(custom(x),x)`).buildFunction();
	let y = fi(100);
	console.log('fi(100)', y)

}
function test0_nerd() {
	//You can interact with the parser directly by getting the core
	//with nerdamer loaded either in a web page or node.js
	var core = nerdamer.getCore();
	//the parser can be accessed in the core through PARSER. 
	//Make a shortcut using underscore
	var _ = core.PARSER;
	//when parsing the function first looks into the built-in Math object
	//and then into the Math2 object
	//add a custom function
	//core.Math2.custom = function (a, b) { return (2 * a + b) / a; };
	core.Math2.custom = function (x) { return (100 * formula1(x)).toFixed(4); };
	//let nerdamer know that it's ok to access this function
	//we do that using an array. The first parameter is the special handler
	//which we'll leave blank for now. This will only give it numeric capabilities
	_.functions.custom = [, 1];
	//we can now use the function
	var x = nerdamer('custom(140)').evaluate();
	console.log(x.toString()); //5
	//return custom;
}




function formula0(x, mean, stdev) {
	let v = stdev * stdev;
	let t = Math.sqrt(Math.PI * 2) * stdev;
	let t1 = 1 / t;
	let t2 = (x - mean) ** 2;
	let t3 = 2 * v;
	let t4 = -t2 / t3;
	let t5 = Math.E ** t4;
	return t1 * t5;

	//return amp * Math.E ** (-(x ** 2) / (2 * v)) / Math.sqrt(v * 2 * Math.PI); 
}
function formula1(x) {
	return formula0(x, 100, 15);
}
function test_formula0() {
	let sum = 0;
	for (let x = 100; x <= 145; x++) {
		let y = formula0(x, 100, 15);
		sum += y;
		console.log('x', x, 'y', Math.round(y * 100), Math.round(sum));
	}
}

function test_formula0() {

	let fi = nerdamer(`integrate(formula1(x),x)`).buildFunction();
	let y = fi(100);
	console.log('')

	let f = x => formula0(x, 100, 115);
	let sum = 0;
	for (let x = 100; x <= 145; x++) {
		let y = formula0(x, 100, 15);
		sum += y;
		console.log('x', x, 'y', Math.round(y * 100), Math.round(sum));
	}
}


function simple_gaussian(canvas, mean = 100, stdev = 7, granularity = 25) {

	let variance = stdev * stdev;
	let b = granularity;
	let cx = canvas.cx;
	let cv = canvas.cv;
	cx.fillStyle = 'silver'


	for (var j = 0; j < 2 * b; j++) {
		let x = j - b;
		//var y = mean / Math.pow(Math.E, (Math.pow(j - b, 2)) / (2 * variance)); //===
		//var y = mean / Math.pow(Math.E, ((j - b) ** 2) / (2 * variance)); //===
		var y = mean / Math.E ** (((j - b) ** 2) / (2 * variance));

		// amp * Math.E ** (-(x ** 2) / (2 * v)) / Math.sqrt(v * 2 * Math.PI);

		console.log('x', x, 'y', y)
		cx.fillRect(j * 10, cv.height - y, 10, y);
		//cx.stroke();
	}
	// <canvas id='c' height='200' width='500'></canvas>
}
function simple_gaussian(canvas) {
	var mean = 100;
	var b = 25;
	var stdev = 10;
	let variance = stdev * stdev;

	var cv = canvas.cv;
	var cx = canvas.cx;
	cx.strokeStyle = 'silver';
	let width_of_rect = cv.width / (4 * b); let w = width_of_rect;


	for (var j = 0; j < 2 * b; j++) {
		//var y = mean / Math.pow(Math.E, (Math.pow(j - b, 2)) / (2 * variance)); //===>
		let x = j - b;
		var y = mean / Math.E ** (((j - b) ** 2) / (2 * variance));
		console.log('x', x, 'y', y)
		cx.rect(j * w + 125, cv.height - y, w, y);
		cx.stroke();
	}
}










