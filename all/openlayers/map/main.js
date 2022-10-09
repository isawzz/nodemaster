
const style = new ol.style.Style({
	fill: new ol.style.Fill({
		color: '#eeeeee',
	}),
});

const vector = new ol.layer.Vector({
	source: new ol.source.Vector({
		url: 'https://openlayers.org/data/vector/ecoregions.json',
		format: new ol.format.GeoJSON(),
	}),
	background: 'white',
	style: function (feature) {
		const color = feature.get('COLOR') || '#eeeeee';
		style.getFill().setColor(color);
		return style;
	},
});

const map = new ol.Map({
	layers: [vector],
	target: 'map',
	view: new ol.View({
		center: [0, 0],
		zoom: 2,
	}),
});

let select = null; // ref to currently selected interaction

const selected = new ol.style.Style({
	fill: new ol.style.Fill({
		color: '#eeeeee',
	}),
	stroke: new ol.style.Stroke({
		color: 'rgba(255, 255, 255, 0.7)',
		width: 2,
	}),
});

function selectStyle(feature) {
	const color = feature.get('COLOR') || '#eeeeee';
	selected.getFill().setColor(color);
	return selected;
}

// select interaction working on "singleclick"
const selectSingleClick = new ol.interaction.Select({ style: selectStyle });

// select interaction working on "click"
const selectClick = new ol.interaction.Select({
	condition: ol.events.condition.click,
	style: selectStyle,
});

// select interaction working on "pointermove"
const selectPointerMove = new ol.interaction.Select({
	condition: ol.events.condition.pointerMove,
	style: selectStyle,
});

const selectAltClick = new ol.interaction.Select({
	style: selectStyle,
	condition: function (mapBrowserEvent) {
		return click(mapBrowserEvent) && ol.events.condition.altKeyOnly(mapBrowserEvent);
	},
});

const selectElement = document.getElementById('type');

const changeInteraction = function () {
	if (select !== null) {
		map.removeInteraction(select);
	}
	const value = selectElement.value;
	if (value == 'singleclick') {
		select = selectSingleClick;
	} else if (value == 'click') {
		select = selectClick;
	} else if (value == 'pointermove') {
		select = selectPointerMove;
	} else if (value == 'altclick') {
		select = selectAltClick;
	} else {
		select = null;
	}
	if (select !== null) {
		map.addInteraction(select);
		select.on('select', function (e) {
			document.getElementById('status').innerHTML =
				'&nbsp;' +
				e.target.getFeatures().getLength() +
				' selected features (last operation selected ' +
				e.selected.length +
				' and deselected ' +
				e.deselected.length +
				' features)';
		});
	}
};

/**
 * onchange callback on the select element.
 */
selectElement.onchange = changeInteraction;
changeInteraction();