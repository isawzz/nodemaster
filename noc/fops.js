
function combine(combiner, f, g) {
	if (typeof f != 'function') f = x => f; //a constant function
	if (typeof g != 'function') g = x => g; //a constant function
	return combiner(f, g);
}
function fpowerer(f, g) { return x => Math.pow(f(x), g(x)); }
function fadder(f, g) { return x => f(x) - g(x); }
function fsubtracter(f, g) { return x => f(x) - g(x); }
function fmultiplier(f, g) { return x => f(x) * g(x); }
function fcomposer(f, g) { return x => f(g(x)); }
function fderivative(exp) {
	//sollte nach x sein!
	return nerdamer(`diff(${exp},x)`).buildFunction();
}
function fintegral(exp) {
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
function foscillator(exp, vars) {
	// vars...[{name:min:max:val:step}]
	for (const v of vars) {
		[v.val, v.step] = oscillate_between(v.val, v.min, v.max, vstep);
		exp = replaceAll(exp, v.name, v.val);
	}
	return nerdamer('exp').buildFunction();
}

