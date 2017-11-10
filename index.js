var PointObj = function (index, coords) {
	this.index = index;
	this.coords = coords;
	this.area = 0;
	this.needsrefresh = true;
};

PointObj.prototype.setArea = function (previousP, nextP) {
	var _this = this;
	if (!this.area || this.needsrefresh) {
		var polygon = turf.polygon([
			[previousP.coords, _this.coords, nextP.coords, previousP.coords]
		]);
		_this.area = Math.abs(turf.area(polygon));
		_this.needsrefresh = false;
	}
};

var PolygonObj = function (polygonFeature) {
	var _this = this;

	this.minArea = 0;
	this.pointArray = []
	turf.coordEach(polygonFeature, function (currentCoord, coordIndex, featureIndex, featureSubIndex) {

		_this.pointArray.push(new PointObj(coordIndex, currentCoord));
	});

	_this.lastPoint_Aux = this.pointArray.pop();

};


PolygonObj.prototype.getPointAreas = function () {

	var _this = this,
		lastIndex = this.pointArray.length - 1,
		firstPoint = this.pointArray[0],
		lastPoint = this.pointArray[lastIndex];

	_this.pointArray = _.map(_this.pointArray, function (pointObj, index) {
		pointObj.index = index;
		return pointObj;
	});

	firstPoint.setArea(lastPoint, _this.pointArray[1]);
	for (var i = 1; i < lastIndex; i++) {
		_this.pointArray[i].setArea(_this.pointArray[i - 1], _this.pointArray[i + 1]);
	}
	lastPoint.setArea(_this.pointArray[lastIndex - 1], firstPoint);
};

PolygonObj.prototype.removePointWithMinArea = function () {
	var _this = this,
		lastIndex = this.pointArray.length - 1,
		firstPoint = this.pointArray[0],
		lastPoint = this.pointArray[lastIndex];

	_this.getPointAreas();

	var pointWithSmallerArea = _.min(this.pointArray, function (pointObj) {
		return pointObj.area;
	});
	//console.log('pointWithSmallerArea in ' + this.pointArray.length + ' elements is', pointWithSmallerArea);

	if (pointWithSmallerArea.index === 0) {
		lastPoint.needsrefresh = true;
		this.pointArray[pointWithSmallerArea.index + 1].needsrefresh = true;
	} else if (pointWithSmallerArea.index === lastIndex) {
		this.pointArray[pointWithSmallerArea.index - 1].needsrefresh = true;
		firstPoint.needsrefresh = true;
	} else {
		this.pointArray[pointWithSmallerArea.index - 1].needsrefresh = true;
		this.pointArray[pointWithSmallerArea.index + 1].needsrefresh = true;
	}

	_this.minArea = pointWithSmallerArea.area;
	_this.pointArray = _.filter(_this.pointArray, function (pointObj) {
		return pointObj.index !== pointWithSmallerArea.index;
	});
	//console.log(_this.pointArray);
	return _this;
};

PolygonObj.prototype.simplify_vw = function (percentage) {

	var original_length = this.pointArray.length;

	while (this.pointArray.length > original_length * percentage) {
		this.removePointWithMinArea();
	}

	var coords = _.map(this.pointArray, function (pointObj) {
		return pointObj.coords;
	});
	coords.push(coords[0]);

	return turf.polygon([
		coords
	]);

};


var simplify_vw = function (polygonFeature, percentage) {
	var polygonObj = new PolygonObj(polygonFeature);
	return polygonObj.simplify_vw(percentage);
};

var simplified_vw,
	simplified_dp,
	layer_vw_added = false,
	layer_dp_added = false;

jQuery(document).ready(function () {

	var mymap = L.map('map').setView({
		lat: -36.79,
		lng: -72.29
	}, 11);
	window.mymap = mymap;

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox.streets',
		accessToken: 'pk.eyJ1IjoiYW1lbmFkaWVsIiwiYSI6ImNqOThlbHZyaDBnb2gycXA5Ym5zMDM4bngifQ.rnqmSWOgkmINesyjcxITVw'
	}).addTo(mymap);

	mymap.panTo({
		lat: -36.790409,
		lng: -72.289991
	});


	var LayerOriginal = L.geoJSON([], {
		style: {
			fillColor: '#aaa',
			"color": "#0000ff",
			"weight": 3,
			"opacity": 1,
			fillOpacity: 0.2
		}
	});
	var LayerDP = L.geoJSON([], {
		style: {
			fillColor: '#aaa',
			"color": "#ff0000",
			"weight": 3,
			"opacity": 1,
			fillOpacity: 0
		}
	});

	var LayerVW = L.geoJSON([], {
		style: {
			fillColor: '#aaa',
			"color": "#00ff00",
			"weight": 3,
			"opacity": 1,
			fillOpacity: 0
		}
	});
	LayerOriginal.addTo(mymap);


	LayerOriginal.addData(featurePolygon);
	jQuery('#original_points').text('(' + featurePolygon.geometry.coordinates[0].length + 'vertices)');


	simplified_vw = simplified_vw || simplify_vw(featurePolygon, 0.49);


	simplified_dp = simplified_dp || turf.simplify(featurePolygon, {
		tolerance: 0.0003,
		highQuality: false
	});
	LayerVW.addData(simplified_vw);
	LayerDP.addData(simplified_dp);

	jQuery('#simplify-dp').on('click', function () {
		if (layer_dp_added) {
			mymap.removeLayer(LayerDP);
			layer_dp_added = false;
		} else {
			mymap.addLayer(LayerDP);
			layer_dp_added = true;
		}
		jQuery('#sdp_points').text('(' + simplified_dp.geometry.coordinates[0].length + 'vertices)')
	});

	jQuery('#simplify-vw').on('click', function () {
		if (layer_vw_added) {
			mymap.removeLayer(LayerVW);
			layer_vw_added = false;
		} else {
			mymap.addLayer(LayerVW);
			layer_vw_added = true;
		}

		jQuery('#svw_points').text('(' + simplified_vw.geometry.coordinates[0].length + 'vertices)')
	});


});
