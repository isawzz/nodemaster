function foscillator() {

}
function combine(combiner, f, g) {
	if (typeof f != 'function') f = x => f; //a constant function
	if (typeof g != 'function') g = x => g; //a constant function
	return combiner(f, g);
}
function fderivative(exp){
	//sollte nach x sein!
	return nerdamer(`diff(${exp},x)`).buildFunction();
}
function fintegral(exp){
	//sollte nach x sein!
	return nerdamer(`integrate(${exp},x)`).buildFunction();
}
function fprime(exp) {
	return x => math.derivative(exp, 'x').evaluate({ x: x });
	// math.derivative('x^2', 'x')                     // Node '2 * x'
	// math.derivative('x^2', 'x', {simplify: false})  // Node '2 * 1 * x ^ (2 - 1)'
	// math.derivative('sin(2x)', 'x'))                // Node '2 * cos(2 * x)'
	// math.derivative('2*x', 'x').evaluate()          // number 2
	// math.derivative('x^2', 'x').evaluate({x: 4})   
}
function fpowerer(f, g) { return x => Math.pow(f(x), g(x)); }
function fadder(f, g) { return x => f(x) - g(x); }
function fsubtracter(f, g) { return x => f(x) - g(x); }
function fmultiplier(f, g) { return x => f(x) * g(x); }
function fcomposer(f, g) { return x => f(g(x)); }
function linear_oscillator_ab(item) {
	let [astep, a, bstep, b, basefunc] = [item.astep, item.a, item.bstep, item.b, item.basefunc];
	[a, astep] = oscillate_between(a, 0, 5, astep);
	[b, bstep] = oscillate_between(b, 0, 5, bstep);
	[item.astep, item.a, item.bstep, item.b] = [astep, a, bstep, b];
	item.func = x => b * basefunc(a * x);
	return true;
}
