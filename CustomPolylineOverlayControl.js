/**
 * @author Pranav
 * @description CustomPolylineOverlayControl is a tool to project google maps polylines on a custom overlay
 */

CustomPolylineOverlay.prototype = new google.maps.OverlayView();

/** 
 * @constructor CustomPolylineOverlay
 * @description Initializes the custom polyline overlay
 * 
 * @param vehicle
 * @param polylineOptions
 * @param map
 */
function CustomPolylineOverlay(vehicle, polylineOptions, map) {
	// Initialize all properties.
	this.polyline_ = new google.maps.Polyline(polylineOptions);
	this.vehicle_ = vehicle;
	this.map_ = map;
	
	// Define a property to hold the infowindow content. 
	var div = document.createElement('div');
	div.className = "smallInfoWindow";
	div.innerHTML = "<div>".concat(this.vehicle_.name).concat("</div>");
	div.id = this.vehicle_.id;
	this.div_ = div;
}

/**
 * @addon onAdd
 * @description onAdd is called when the setMap function is called on the overlay object with a valid map object as a parameter
 */
CustomPolylineOverlay.prototype.onAdd = function() {
    // Add the polyline on the map
	this.polyline_.setMap(this.map_);

	// Add the element to the "overlayMouseTarget" pane.
	var panes = this.getPanes();
	panes.overlayMouseTarget.appendChild(this.div_);
};

/**
 * @addon onRemove
 * @description onRemove is called when the setMap function is called on the overlay object with null parameter
 */
CustomPolylineOverlay.prototype.onRemove = function() {
	// Removes the polyline from the map
	this.polyline_.setMap(null);
	this.div_.parentNode.removeChild(this.div_);
};

/**
 * @addon draw
 * @description draw is called when the setMap function is called on the overlay object
 */
CustomPolylineOverlay.prototype.draw = function() {
	// We use the south-west and north-east
	// coordinates of the overlay to peg it to the correct position and size.
	// To do this, we need to retrieve the projection from the overlay.
	var overlayProjection = this.getProjection();
	var bounds = new google.maps.LatLngBounds();
	var sw;
	var ne;
	var div;
	
	bounds.extend(this.getPosition());

	// Retrieve the south-west and north-east coordinates of this overlay
	// in LatLngs and convert them to pixel coordinates.
	// We'll use these coordinates to resize the div.
	if(overlayProjection){
		sw = overlayProjection.fromLatLngToDivPixel(bounds.getSouthWest());
		ne = overlayProjection.fromLatLngToDivPixel(bounds.getNorthEast());
		
		div = this.div_;
		// Reposition the div on adjusting zoom
		div.style.left = sw.x + 'px';
		div.style.top = ne.y + 'px';
	}
};

/**
 * returns the color of the vehicle based on the speed (mph)
 * 
 * @param speed
 */
function getVehicleColorBySpeed(speed) {
	var color;
	if(speed > 5) {
		color = 'green';
	}else{
		color = 'red';
	}
	return color;
}

/**
 * @addon getPosition
 * @description getPosition returns the recent latLng object that has been pushed into the polyline path
 */
CustomPolylineOverlay.prototype.getPosition = function() {
	var path = this.polyline_.getPath();
	if(path.getAt(path.getLength()-1)){
		return path.getAt(path.getLength() - 1);
	} 
	
	return null;
};

/**
 * @addon addLatLng 
 * @description addLatLng pushes a latLng object into the path of the polyline
 * 
 * @param latLng
 * @param vehicle
 */
CustomPolylineOverlay.prototype.addLatLng = function(latLng, vehicle) {
	this.vehicle_ = vehicle;
	this.polyline_.getPath().push(latLng)
};

/**
 * @addon plotPolyline
 * @description Plays the svg icon on the polyline based on certain conditions
 */
CustomPolylineOverlay.prototype.plotPolyline = function() {
	var itr=0;
	var path = this.polyline_.getPath();
	var length = path.getLength();
	var intervalObj;
	
	//Plots the svg on the polyline only when the latest geo point for the vehicle is different from the previous one 
	if(path.getAt(length-1) && path.getAt(length-2) && path.getAt(length-1).lat() !== path.getAt(length-2).lat() && path.getAt(length-1).lng() !== path.getAt(length-2).lng()) {
		intervalObj = setInterval(function(polyline, vehicle){
			var icons = polyline.get('icons');
		
			if(icons[0].icon){
				icons[0].icon.fillColor = getVehicleColorBySpeed(kmToMiles(vehicle.speed));
			}
		
			// Allowing a smooth transition from one place to another
			icons[0].offset = (((length-2)/(length-1))*100+(itr/(length-1))).toString().concat('%'); //Incrementing the percentage offset to plot from the last but one point to the last point
			polyline.set('icons', icons);
			itr++;
			if(itr===101) {
				clearInterval(intervalObj);
			}
		},20, this.polyline_, this.vehicle_);
	}
	
	setTimeout(function(customOverlay){
		customOverlay.draw();
	},2000, this)
};

/**
 * @addon getLength 
 * @description getLength returns the length of the polyline path
 */
CustomPolylineOverlay.prototype.getLength = function() {
	return this.polyline_.getPath().getLength();
};

/**
 * @addon removeAt
 * @description removeAt removes the latLng at i th position from the path array of the polyline
 */
CustomPolylineOverlay.prototype.removeAt = function(i) {
	this.polyline_.getPath().removeAt(i)
};