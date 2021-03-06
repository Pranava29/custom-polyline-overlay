# custom-polyline-overlay
SVGs plotted on Google Maps polylines are not clickable for more information. We have seen live vehicles moving on the map but we never tap on them for more information. This is because google maps allows clicking on objects and does not render svgs mentioned in the icon sequence of the polyline as objects. So, we cannot click on them. Thus, we need to create a google maps custom overlay* for better usability. 

This library file can be used to plot svgs on a polyline with more ease and customization. It adds a small info window next to the svg so that we can click on them to get more stats of the moving entity. 

Customization: 

1. SVGs can be played on the map smoothly as per user needs.

2. Depending on vehicle speed, the SVG icons change color.

3. Small info window can be styled as per user needs.

4. Updates the position of the moving entity and plays it on the polyline to move it to the new location.

### Usage and Example:

Inculde CustomPolylineOverlayControl.js and styles.css files in your project path. Now you are ready to use the library in any js file of the project.

```javascript
var customPolyline = new CustomPolylineOverlay(vehicleObj, polylineOptions, mapObj);
customPolyline.addLatLng(latLng,vehicleObj);
customPolyline.plotPolyline();
```

### Legend:

1. Example of polyline options:

```javascript
{

	strokeColor: '#000',
	
  	strokeOpacity: 0,
	
  	strokeWeight: 10,

	icons: [
	
	{
      		
		icon: {
       
       			path: <SVG>, //SVG string or path foes here
			
        		anchor: newgoogle.maps.Point(47.5, 0),
			
       			strokeColor: '#000',
			
        		strokeOpacity: 0.5,
			
        		fillColor: 'red', //Car/SVGcolor
			
       			fillOpacity: 1,
			
        		scale: 0.11      //Car/SVGsize/scale
     		 },
			
		 offset: '0%'
		 
    	}
	
  	]
	
}
```

Work in progress : 

1. Working to integrate with snap to roads to make the vehicle stick on roads when played.

2. Live Examples.


Note: * Google maps divides the map into panes and overlayMouseTarget pane is the one which receives user clicks
