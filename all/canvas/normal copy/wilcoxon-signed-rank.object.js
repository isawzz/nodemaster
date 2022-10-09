//<!--XXXXXXXXXXXXXXXXXXXXXXXXXX-->
//<!--Copyright 2016 Matt Bognar-->
//<!--XXXXXXXXXXXXXXXXXXXXXXXXXXX-->

//<!--Written by:-->
//<!--Matt Bognar-->
//<!--Department of Statistics and Actuarial Science-->
//<!--University of Iowa-->
//<!--Iowa City, IA 52242-->
//<!--This software may not be re-distributed without the authors consent.-->


function wilcoxonDistribution(n) {
	this.n = eval(n);
	this.mean = mean;
	this.variance = variance;
	this.sd = sd;
	this.pmf = pmf;
	this.cdf = cdf;
	this.printMoments = printMoments;
	this.plotPmf = plotPmf;

	this.xmin = 0;
	this.xmax = this.n * (this.n + 1) / 2;


	function mean() {
		return this.n * (this.n + 1) / 4;
	}


	function variance() {
		return this.n * (this.n + 1) * (2 * this.n + 1) / 24;
	}


	function sd() {
		return Math.sqrt(this.variance());
	}


	function pmf(x) {
		if (x >= this.xmin && x <= this.xmax) {
			return (cnum(x, this.n) / (Math.pow(2, this.n)))
		}
		else {
			return 0;
		}
	}


	function cnum(x, n) {
		if (x < 0 || x > (n * (n + 1) / 2) || n < 1) return (0)
		else if (n == 1) return (1)
		else return ((cnum(x, n - 1) + cnum(x - n, n - 1)))
	}


	function cdf(x) {
		var i;
		var cdfval = 0;

		for (i = this.xmin; i <= x; i++) {
			cdfval = cdfval + this.pmf(i);
		}

		if (x == this.xmax) {
			cdfval = 1;
		}

		return cdfval;
	}


	function printMoments() {
		var txt = "";

		txt += '$ \\mu = E(W) = ' + roundNumber(this.mean(), 3) + '\\hspace{0.5cm}$';
		txt += '$ \\sigma = SD(W) = ' + roundNumber(this.sd(), 3) + '\\hspace{0.5cm}$';
		txt += '$ \\sigma^2 = Var(W) = ' + roundNumber(this.variance(), 3) + '$';

		document.getElementById("moments").innerHTML = txt;
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, "moments"]);
	}


	function plotPmf(x, type) {

		var data = new google.visualization.DataTable();
		// Create the data table.
		data.addColumn('number', 'w');
		data.addColumn('number', 'P(W=w)');
		data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
		data.addColumn('number', 'P(W=w)');

		xlo = this.xmin;
		xhi = this.xmax + 1;

		data.addRows(xhi + 3);

		var i;
		for (i = 0; i <= xhi + 1; i++) {
			data.setCell(i, 0, i);
			data.setCell(i, 1, roundNumber(this.pmf(i), 5));
			data.setCell(i, 2, 'P(W=' + i + ') = ' + data.getValue(i, 1));

			if (type == 0) {
				if (i == x) {
					data.setCell(i, 1, 0);
					data.setCell(i, 3, roundNumber(this.pmf(i), 5));
				}
			}
			if (type == 1) {
				if (i <= x) {
					data.setCell(i, 1, 0);
					data.setCell(i, 3, roundNumber(this.pmf(i), 5));
				}
			}
			if (type == 2) {
				if (i >= x) {
					data.setCell(i, 1, 0);
					data.setCell(i, 3, roundNumber(this.pmf(i), 5));
				}
			}
		}

		var dataView = new google.visualization.DataView(data);
		dataView.setColumns([{
			calc: function (data, row) {
				return data.getFormattedValue(row, 0);
			}, type: 'string'
		}, 1, 2, 3]);

		// Set chart options
		var options =
		{
			backgroundColor: 'transparent',
			hAxis: {
				title: 'w', titleTextStyle: { color: '#000000' },
				gridlines: { color: 'transparent' },
				viewWindow: { min: xlo, max: xhi }
			},
			vAxis: {
				title: 'P(W=w)', titleTextStyle: { color: '#000000' },
				gridlines: { count: 5, color: 'transparent' },
				viewWindow: { min: 0 },
				viewWindowMode: 'explicit'
			},
			legend: { position: 'none' },
			seriesType: "bars",
			isStacked: true,
			colors: ['#6687e7', '#ca8d8d'],
		};

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.visualization.ComboChart(document.getElementById('pmfPlot'));
		chart.draw(dataView, options);

	}


	function isEven(nt) {
		this.nt = eval(nt);
		return this.nt % 2 == 0;
	}


	function isOdd(nt) {
		this.nt = eval(nt);
		return Math.abs(this.nt % 2) == 1;
	}

}


