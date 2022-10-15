
function dream0() {
	let pin = fiddle();

	let f = x => x + rGaussian(-.01, .02); //-.1,.1);  //rAddSubRange(.01);
	run_for_seconds(2, () => map_moveby(pin, f, f))

	return;

	create_map({ center: [0, 0], zoom: 5 });

	create_agent(M.map);

}


function fiddle() {
	var map = L.map('map', {
		maxZoom: 18,
		preferCanvas: true
	}).setView([51.505, -0.09], 7);

	let info = Geo.layerInfo.osm;
	L.tileLayer(info.url, info.options).addTo(map);
	//L.tileLayer('https://api.mapbox.com/v3/openstreetmap.1b68f018/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJhNVlHd29ZIn0.ti6wATGDWOmCnCYen-Ip7Q').addTo(mymap);


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
			cEllipse(p.x, p.y, 2*r,2*r, { bg: 'orange' }, 0, ctx);
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























