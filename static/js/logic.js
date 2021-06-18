// Creating loops to find the max/min values of depth/magnitude to create bins later

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson").then(function(data) {
    console.log(data.features[1].properties.mag) 
    j=1000
    for (var i = 0; i < data.features.length; i++) {
        if (data.features[i].properties.mag < j) {
            j = data.features[i].properties.mag 
        }
    }        
    console.log(`The minimum value for magnitudes is: ${j}`)
    
    j=0
    for (var i = 0; i < data.features.length; i++) {
        if (data.features[i].properties.mag > j) {
            j = data.features[i].properties.mag 
        }
    }    
     
    console.log(`The maximum value for magnitude is: ${j}`)

    for (var i = 0; i < data.features.length; i++) {
        if (data.features[i].geometry.coordinates[2] < j) {
            j = data.features[i].geometry.coordinates[2] 
        }
    } 

    console.log(`The minimum value for depth is: ${j}`)

    for (var i = 0; i < data.features.length; i++) {
        if (data.features[i].geometry.coordinates[2] > j) {
            j = data.features[i].geometry.coordinates[2] 
        }
    } 

    console.log(`The maximum value for depth is: ${j}`)
    var depsum = 0
    for (var i = 0; i < data.features.length; i++) {
       depsum = data.features[i].geometry.coordinates[2] + depsum
    }
    depavg = depsum/data.features.length
    console.log(`the average depth is ${depavg}`)
    

});
// Creating map object
var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 3
  });
  
  // Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 50,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
}).addTo(myMap);

// function for determining color based on the depth
function Bubblecolor(depth) {
    if (depth > 150) {
        return "#FF0000";
    }
    else if (depth > 90) {
        return "#FF631F";
    }
    else if (depth > 50) {
        return "#FFA71F";
    }
    else if (depth > 20) {
        return "#F5FB39";
    }
    else {
        return "#9BFE49";
    }
}
// function for sizing radius based on magnitude

function Bubbleradius(mag) {
    return mag * 2.5;
}


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson").then(function(data) {
    function Mapstyle(item) {
        return {
            fillColor: Bubblecolor(item.geometry.coordinates[2]),
            fillOpacity: 1,
            radius: Bubbleradius(item.properties.mag),
            weight: 0.2
        };
    }

    L.geoJson(data, {
        style: Mapstyle,

        pointToLayer: function(item, latlng) {
            return L.circleMarker(latlng);
        },


//Add Popup values on marker
        onEachFeature: function(item, layer) {
            layer.bindPopup(
                "<b>Location:</b><br>"
                    + item.properties.place
                    + "<br><b>Depth:</b><br>"
                    + item.geometry.coordinates[2] 
                    + "<br><b>Magnitude:</b><br>"
                    + item.properties.mag
                    + "<br><b>Number of 'felt' reports:</b><br>"
                    + item.properties.felt
            );
        }
    }).addTo(myMap);
// ADD LEGEND 
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');

    
    var depths = ["0", 20, 50, 90, 150];
    var colors = ["#9BFE49","#F5FB39","#FFA71F","#FF631F","#FF0000"];
    
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML += "<i style='background-color: "
        + colors[i] + "'></i> "
        + depths[i] + (depths[i + 1] ? "&ndash;"
        + depths[i + 1] + "  depth" + "<br>" : "+ depth");
      }
      return div;
    };

    legend.addTo(myMap);
});




