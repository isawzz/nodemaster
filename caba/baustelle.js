
function create_map(o = {}) {
	addKeys({ maxBounds: [[-89.98155760646617, -180], [89.99346179538875, 180]], key: 'osm', center: Geo.places.tuerkenschanzpark, zoom: 17, id: 'map' }, o);
	let info = Geo.layerInfo[o.key]; 
	o.layers = [isdef(info) ? L.tileLayer(info.url, info.options) : L.tileLayer('')];
	let map = L.map(o.id, o);
	return map;
}
function create_toolbar(map, key = 'hallo', styles={}) {
	addKeys({ cursor:'pointer', box:true, padding:14, w:200, display:'flex', position:'topleft' },styles);
	d = mDiv(null, styles);
	
	L.Control[key] = L.Control.extend({
		onAdd: function (map) { return d; },
		onRemove: function (map) {  }
	});

	return new L.Control[key](styles).addTo(map);

	L.control[key] = function (opts) { return new L.Control[key](opts); }
	return  L.control[key]({ position: 'bottomleft',  }).addTo(map);
}


function create_button(map, key = 'hallo', handler, styles, d) {
	if (nundef(d)) d = mDiv(null, { bg: 'random', w: 25, h: 25 });
	if (nundef(handler)) handler = e => console.log('clicked', e.target);
	if (nundef(styles)) styles = {cursor:'pointer'};
	if (isdef(styles)) mStyle(d,styles);
	
	L.Control[key] = L.Control.extend({
		onAdd: function (map) { L.DomEvent.on(d, 'click', handler); return d; },
		onRemove: function (map) { L.DomEvent.off(d, 'click', handler) }
	});

	return new L.Control[key]({position: 'bottomleft'}).addTo(map);

	L.control[key] = function (opts) { return new L.Control[key](opts); }
	return  L.control[key]({ position: 'bottomleft',  }).addTo(map);
}

function create_control(map, key) {
	L.Control[key] = L.Control.extend({
		onAdd: function (map) {

			//var d = L.DomUtil.create('div');
			//mStyle(d, { bg: 'red', w: 25, h: 25, margin: 'auto' });
			var img = L.DomUtil.create('img'); img.src = '../base/assets/users/felix.jpg'; img.style.width = '40px';

			L.DomEvent.on(img, 'click', e => console.log('clicked', e.target))
			return img;
		},

		onRemove: function (map) {
			// Nothing to do here
			//L.DomEvent.off()
		}
	});

	L.control[key] = function (opts) {
		return new L.Control[key](opts);
	}

	L.control[key]({ position: 'bottomleft' }).addTo(map);
}

function test_control0(map) {
	L.Control.Watermark = L.Control.extend({
		control: null,
		onAdd: function (map) {
			var div = L.DomUtil.create('div');
			div.style = 'background-color: white; border: 1px gray solid; padding: 1px 4px;'
			div.innerHTML = 'Custom control content';
			return div;
		},
		onRemove: function (map) {
		},
		updateContent: function (newContent) {
			this.getContainer().innerHTML = newContent;
		}
	});

	L.control.watermark = function (opts) {
		return new L.Control.Watermark(opts);
	}
	//If you then create your map control with

	var myControl = L.control.watermark({ position: 'bottomleft' }).addTo(map);
	return myControl;
}














function map_toolbutton(map, color, handler) {
	let MyCustomAction = L.Toolbar2.Action.extend({

		options: {
			toolbarIcon: {
				html: mDiv(null, { margin: 'auto', w: 25, h: 25, bg: color }).outerHTML,
				// html: `<span style="font-size:28px">&phone;</span>`,
				tooltip: 'Go to the Eiffel Tower'
			}
		},

		addHooks: handler

	});

	new L.Toolbar2.Control({
		actions: [MyCustomAction]
	}).addTo(map);
}



function toolbartest(map) {

	var ImmediateSubAction = L.Toolbar2.Action.extend({
		initialize: function (map, myAction) {
			this.map = map;
			this.myAction = myAction;
			L.Toolbar2.Action.prototype.initialize.call(this);
		},
		addHooks: function () {
			this.myAction.disable();
		}
	});
	var World = ImmediateSubAction.extend({
		options: {
			toolbarIcon: {
				html: 'World',
				tooltip: 'See the whole world'
			}
		},
		addHooks: function () {
			this.map.setView([0, 0], 0);
			ImmediateSubAction.prototype.addHooks.call(this);
		}
	});
	var Eiffel = ImmediateSubAction.extend({
		options: {
			toolbarIcon: {
				html: 'Eiffel Tower',
				tooltip: 'Go to the Eiffel Tower'
			}
		},
		addHooks: function () {
			this.map.setView([48.85815, 2.29420], 19);
			ImmediateSubAction.prototype.addHooks.call(this);
		}
	});
	var Cancel = ImmediateSubAction.extend({
		options: {
			toolbarIcon: {
				html: '<i class="fa fa-times"></i>',
				tooltip: 'Cancel'
			}
		}
	});
	var MyCustomAction = L.Toolbar2.Action.extend({
		options: {
			toolbarIcon: {
				className: 'fa fa-eye',
			},
			/* Use L.Toolbar2 for sub-toolbars. A sub-toolbar is,
			 * by definition, contained inside another toolbar, so it
			 * doesn't need the additional styling and behavior of a
			 * L.Toolbar2.Control or L.Toolbar2.Popup.
			 */
			subToolbar: new L.Toolbar2({
				actions: [World, Eiffel, Cancel]
			})
		}
	});
	new L.Toolbar2.Control({
		position: 'topleft',
		actions: [MyCustomAction]
	}).addTo(map);

	return;
	//NOPE:
	map_toolbutton(map, 'red', () => console.log('red'));
	map_toolbutton(map, 'blue', () => console.log('blue'));
	map_toolbutton(map, 'green', () => console.log('green'));
	map_toolbutton(map, 'yellow', () => console.log('yellow'));
	return;

	var MyCustomAction = L.Toolbar2.Action.extend({

		options: {
			toolbarIcon: {
				html: mDiv(null, { margin: 'auto', w: 25, h: 25, bg: 'red' }).outerHTML,
				// html: `<span style="font-size:28px">&phone;</span>`,
				tooltip: 'Go to the Eiffel Tower'
			}
		},

		addHooks: function () {
			map.setView([48.85815, 2.29420], 19);
		}

	});

	new L.Toolbar2.Control({
		actions: [MyCustomAction]
	}).addTo(map);
}

















function activate_arrows(key, f) {
	lookupAddToList(DA, ['arrow_handlers', key], f);
	let di = { ArrowUp: 270, ArrowDown: 90, ArrowLeft: 180, ArrowRight: 0 };
	for (const key in di) {
		if (is_key_down(key)) {
			item.v.a = di[key];
			update_position(item);
			return true;
		}
	}
	return false;

}








































