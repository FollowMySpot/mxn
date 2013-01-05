var gex;
mxn.googleEarth = {};
mxn.googleEarth.zoomRange = [
	[0, 63792983],
	[1, 63792983],
	[2, 46688480],
	[3, 23500000],
	[4, 11700000],
	[5, 5700000],
	[6, 2450000],
	[7, 1235000],
	[8, 628000],
	[9, 315000],
	[10, 158000],
	[11, 78700],
	[12, 40000],
	[13, 18300],
	[14, 9800],
	[15, 4750],
	[16, 2350],
	[17, 1150],
	[18, 570],
	[19, 290]];
mxn.googleEarth.zoomToRange = function (zoom) {
	for (i = 0; i < mxn.googleEarth.zoomRange.length; i++)
		if (mxn.googleEarth.zoomRange[i][0] == zoom)
			return mxn.googleEarth.zoomRange[i][1];
};
mxn.googleEarth.rangeToZoom = function (range) {
	var lastRange = 0;
	var zoom = 0;
	for (i = mxn.googleEarth.zoomRange.length - 1; i >= 0; i--) {
		var thisRange = mxn.googleEarth.zoomRange[i][1];
		if (range <= thisRange) {
			if (i == 0)
				zoom = mxn.googleEarth.zoomRange[i][1];
			else if (thisRange - range < range - lastRange)
				zoom = mxn.googleEarth.zoomRange[i][0];
			else
				zoom = mxn.googleEarth.zoomRange[i + 1][0];
			break;
		}
		else
			lastRange = thisRange;
	}
	return zoom;
};
mxn.register('googleearth', {

	Mapstraction: {

		init: function (element, api) {
			var me = this;

			if (typeof google.earth === 'undefined') {
				throw new Error(api + ' map script not imported');
			}

			this.maps[api] = null;

			google.earth.createInstance(
				element,
				function initCallback(object) {
					mxn.googleEarth.map = object;
					me.maps[api] = object;
					me.maps[api].getWindow().setVisibility(true);
					// Note unlike other map providers there is a delay in the map load, you must add the initMap function to your project to be able to add polylines, markers etc.
					initMap();
				},
				function failureCallback(object) {
					throw 'Failed to create Google Earth map';
				}
			);

		},

		applyOptions: function () {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		resizeTo: function (width, height) {
			// TODO: Add provider code
		},

		addControls: function (args) {
			var map = this.maps[this.api];

			// Google Earth has a combined zoom and pan control.
			if (args.zoom || args.pan)
				map.getNavigationControl().setVisibility(map.VISIBILITY_SHOW);
			if (args.scale)
				map.getOptions().setScaleLegendVisibility(true);
			if (args.overview) {
				map.getOptions().setOverviewMapVisibility(true);
			}
		},

		addSmallControls: function () {
			var map = this.maps[this.api];
			map.getNavigationControl().setVisibility(map.VISIBILITY_SHOW);
		},

		addLargeControls: function () {
			var map = this.maps[this.api];
			map.getNavigationControl().setVisibility(map.VISIBILITY_SHOW);
			map.getOptions().setScaleLegendVisibility(true);
			map.getOptions().setOverviewMapVisibility(true);
		},

		addMapTypeControls: function () {
			// Google earth is just Satellite
		},

		dragging: function (on) {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		setCenterAndZoom: function (point, zoom) {
			var map = this.maps[this.api];
			var pt = point.toProprietary(this.api);

			var lookAt = map.getView().copyAsLookAt(map.ALTITUDE_RELATIVE_TO_GROUND);

			// Set new latitude and longitude values
			lookAt.setLatitude(point.lat);
			lookAt.setLongitude(point.lon);
			var range = mxn.googleEarth.zoomToRange(zoom);
			lookAt.setRange(range);

			// Update the view in Google Earth
			map.getView().setAbstractView(lookAt);
		},

		addMarker: function (marker, old) {
			var map = this.maps[this.api];
			var pin = marker.toProprietary(this.api);
			return pin;
		},

		removeMarker: function (marker) {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		removeAllMarkers: function () {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		declutterMarkers: function (opts) {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		addPolyline: function (polyline, old) {
			var map = this.maps[this.api];
			var pl = polyline.toProprietary(this.api);
			map.getFeatures().appendChild(pl);

			return pl;
		},

		removePolyline: function (polyline) {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		getCenter: function () {
			var point;
			var map = this.maps[this.api];

			var lookAt = map.getView().copyAsLookAt(map.ALTITUDE_RELATIVE_TO_GROUND);
			point = new mxn.LatLonPoint(lookAt.getLatitude(), lookAt.getLongitude());
			return point;
		},

		setCenter: function (point, options) {
			var map = this.maps[this.api];
			var pt = point.toProprietary(this.api);
			if (options && options.pan) {
				var lookAt = map.getView().copyAsLookAt(map.ALTITUDE_RELATIVE_TO_GROUND);

				// Set new latitude and longitude values
				lookAt.setLatitude(point.lat);
				lookAt.setLongitude(point.lon);

				// Update the view in Google Earth
				map.getView().setAbstractView(lookAt);
			}
			else {
				// TODO: Add provider code
			}
		},

		setZoom: function (zoom) {
			var map = this.maps[this.api];
			var lookAt = map.getView().copyAsLookAt(map.ALTITUDE_RELATIVE_TO_GROUND);

			var range = mxn.googleEarth.zoomToRange(zoom);
			lookAt.setRange(range);

			// Update the view in Google Earth
			map.getView().setAbstractView(lookAt);
		},

		getZoom: function () {
			var map = this.maps[this.api];
			var lookAt = map.getView().copyAsLookAt(map.ALTITUDE_RELATIVE_TO_GROUND);
			var range = lookAt.getRange();
			var zoom = mxn.googleEarth.rangeToZoom(range);
			return zoom;
		},

		getZoomLevelForBoundingBox: function (bbox) {
			var map = this.maps[this.api];
			var lookAt = map.getView().copyAsLookAt(map.ALTITUDE_RELATIVE_TO_GROUND);
			// NE and SW points from the bounding box.
			var ne = bbox.getNorthEast();
			var sw = bbox.getSouthWest();
			var zoom;

			// TODO: Add provider code

			return zoom;
		},

		setMapType: function (type) {
			var map = this.maps[this.api];
			switch (type) {
				case mxn.Mapstraction.ROAD:
				case mxn.Mapstraction.HYBRID:
					map.getLayerRoot().enableLayerById(map.LAYER_ROADS, true);
					break;
				case mxn.Mapstraction.SATELLITE:
					map.getLayerRoot().enableLayerById(map.LAYER_ROADS, false);
					break;
				case mxn.Mapstraction.PHYSICAL:
				default:
					break;
			}
		},

		getMapType: function () {
			var map = this.maps[this.api];
			if (map.getLayerRoot().getLayerById(map.LAYER_ROADS).getVisibility())
				return mxn.Mapstraction.HYBRID;
			else
				return mxn.Mapstraction.SATELLITE;
		},

		getBounds: function () {
			var map = this.maps[this.api];
			var bounds = map.getView().getViewportGlobeBounds();
			return new mxn.BoundingBox(bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast());
		},

		setBounds: function (bounds) {
			var map = this.maps[this.api];
			var mxnSW = bounds.getSouthWest();
			var mxnNE = bounds.getNorthEast();
			if (gex) {
				// You must include GEarthExtensions and geo for this to work
				// available at http://code.google.com/p/earth-api-utility-library/
				// I tried everything I could think of includin below but no luck
				// var latLonBox = map.createLatLonBox('');
				// latLonBox.setBox(ne.lat, sw.lat, ne.lon, sw.lon, 0);
				// map.getView().setAbstractView(latLonBox);
				// map.getView().getViewportGlobeBounds().setBox(ne.lat, sw.lat, ne.lon, sw.lon, 0);
			}
			else {
				var gex = new GEarthExtensions(map);
			}
			var sw = new geo.Point(mxnSW.lat, mxnSW.lon);
			var ne = new geo.Point(mxnNE.lat, mxnNE.lon);
			var bounds = new geo.Bounds(sw, ne);
			var boundingView = gex.view.createBoundsView(bounds, { aspectRatio: 1.0 });
			map.getView().setAbstractView(boundingView);
		},

		addImageOverlay: function (id, src, opacity, west, south, east, north, oContext) {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		setImagePosition: function (id, oContext) {
			var map = this.maps[this.api];
			var topLeftPoint; var bottomRightPoint;

			// TODO: Add provider code

			//oContext.pixels.top = ...;
			//oContext.pixels.left = ...;
			//oContext.pixels.bottom = ...;
			//oContext.pixels.right = ...;
		},

		addOverlay: function (url, autoCenterAndZoom) {
			var map = this.maps[this.api];

			// TODO: Add provider code

		},

		addTileLayer: function (tile_url, opacity, copyright_text, min_zoom, max_zoom) {
			var map = this.maps[this.api];
			var me = this;

			google.earth.fetchKml(map, tile_url, function (kmlObject) {
				if (kmlObject) {
					map.getFeatures().appendChild(kmlObject);
					me.tileLayers.push([tile_url, kmlObject, true]);
				}
				else {
					throw 'Invalid KML file';
				}
			});
		},

		toggleTileLayer: function (tile_url) {
			var map = this.maps[this.api];

			for (var f = 0; f < this.tileLayers.length; f++) {
				if (this.tileLayers[f][0] == tile_url) {
					if (this.tileLayers[f][2]) {
						map.getFeatures().removeChild(this.tileLayers[f][1]);
						this.tileLayers[f][2] = false;
					}
					else {
						map.getFeatures().appendChild(this.tileLayers[f][1]);
						this.tileLayers[f][2] = true;
					}
				}
			}
		},

		getPixelRatio: function () {
			var map = this.maps[this.api];

			// TODO: Add provider code	
		},

		mousePosition: function (element) {
			var map = mxn.googleEarth.map;
			if (map) {
				mxn.mousePositionElementId = element;
				var locDisp = document.getElementById(element);
				if (locDisp !== null) {
					google.earth.addEventListener(map.getGlobe(), 'mousemove', function (point) {
						var loc = point.getLatitude().toFixed(4) + ' / ' + point.getLongitude().toFixed(4);
						locDisp.innerHTML = loc;
					});
					locDisp.innerHTML = '0.0000 / 0.0000';
				}
			}
		}
	},

	LatLonPoint: {

		toProprietary: function () {
			var point = mxn.googleEarth.map.createPoint('');
			point.setLatitude(this.lat);
			point.setLongitude(this.lon);
			return point;
		},

		fromProprietary: function (googlePoint) {
			// TODO: Add provider code
		}

	},

	Marker: {

		toProprietary: function () {
			var map = mxn.googleEarth.map;
			var placemark = map.createPlacemark('');
			map.getFeatures().appendChild(placemark);
			// Create style map for placemark
			if (this.iconUrl) {
				var icon = map.createIcon('');
				icon.setHref(this.iconUrl); // Needs to be publicly accessible
				var style = map.createStyle('');
				style.getIconStyle().setIcon(icon);
				if (this.iconSize) {
					var scale = (this.iconSize[0] / 20 + this.iconSize[1] / 32) / 2;
					if (scale < 1) {
						style.getIconStyle().setScale(scale);
					}
				}
				placemark.setStyleSelector(style);
			}

			// Create point
			var point = map.createPoint('');
			point.setLatitude(this.location.lat);
			point.setLongitude(this.location.lon);
			point.setAltitudeMode(map.ALTITUDE_CLAMP_TO_GROUND);
			placemark.setGeometry(point);

			if (this.infoBubble) {
				var event_action = "click";
				var marker = this;
				if (this.hover) {
					event_action = "mouseover";
				}
				google.earth.addEventListener(placemark, event_action, function (event) {
					event.preventDefault();
					var balloon = map.createHtmlStringBalloon('');
					balloon.setFeature(placemark);
					balloon.setContentString(marker.infoBubble);
					marker.openInfoBubble.fire({ 'marker': marker });
					map.setBalloon(balloon);
				});
			}
			return placemark;
		},

		openBubble: function () {
			// TODO: Add provider code
		},

		hide: function () {
			// TODO: Add provider code
		},

		show: function () {
			// TODO: Add provider code
		},

		update: function () {
			// TODO: Add provider code
		}

	},

	Polyline: {

		toProprietary: function () {
			// Create the placemark.
			var placemark = mxn.googleEarth.map.createPlacemark('');
			var lineString;
			if (this.closed) {

				// Create the polygon.
				var polygon = mxn.googleEarth.map.createPolygon('');
				polygon.setAltitudeMode(mxn.googleEarth.map.ALTITUDE_CLAMP_TO_GROUND);
				placemark.setGeometry(polygon);

				// Add points for the outer shape.
				lineString = mxn.googleEarth.map.createLinearRing('');
				lineString.setAltitudeMode(mxn.googleEarth.map.ALTITUDE_CLAMP_TO_GROUND);
				for (var i = 0, length = this.points.length; i < length; i++)
					lineString.getCoordinates().pushLatLngAlt(this.points[i].lat, this.points[i].lon, 0);
				polygon.setOuterBoundary(lineString);
			}
			else {
				// Create the LineString.
				lineString = mxn.googleEarth.map.createLineString('');
				placemark.setGeometry(lineString);
				lineString.setAltitudeMode(mxn.googleEarth.map.ALTITUDE_CLAMP_TO_GROUND);

				for (var i = 0, length = this.points.length; i < length; i++)
					lineString.getCoordinates().pushLatLngAlt(this.points[i].lat, this.points[i].lon, 0);
			}

			//Create a style and set width and color of line
			placemark.setStyleSelector(mxn.googleEarth.map.createStyle(''));
			var lineStyle = placemark.getStyleSelector().getLineStyle();
			lineStyle.setWidth(this.width || 3);
			// Converts the format from #RRGGBB to AABBGGRR.
			var rgbColor = this.color || '#000000';
			var abgrColor = 'ff' + rgbColor.substr(5, 2) + rgbColor.substr(3, 2) + rgbColor.substr(1, 2);
			lineStyle.getColor().set(abgrColor);

			return placemark;
		},

		show: function () {
			// TODO: Add provider code
		},

		hide: function () {
			// TODO: Add provider code
		}

	}

});