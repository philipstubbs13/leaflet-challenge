// Create map object.
const map = L.map("map", {
  // Center is at Salt Lake City, UT.
  center: [40.7608, -111.8910],
  zoom: 4
});

// Add tile layer.
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

// All earthquakes in the past day.
const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
const colors = ['#90EE90', '#FFFF00', '#fed8b1', '#FFA500', '#FF8C00', '#8B0000'];
const categories = ['0-1','1-2','2-3','3-4','4-5', '5+'];

// Function that will determine the color of a earthquake based on its magnitude.
const chooseColor = (magnitude) => {
  if (magnitude < 1) {
    return colors[0];
  } else if (magnitude >=1 && magnitude < 2) {
    return colors[1];
  } else if (magnitude >= 2 && magnitude < 3) {
    return colors[2];
  } else if (magnitude >=3 && magnitude < 4) {
    return colors[3];
  } else if (magnitude >=4 && magnitude < 5) {
    return colors[4];
  } else if (magnitude >= 5) {
    return colors[5];
  }
}

// Function to determine marker size based on magnitude
const markerSize = (magnitude) => {
  return magnitude * 4;
}

const geojsonMarkerOptions = {
  radius: 8,
  weight: 1,
  opacity: 1,
};

// Grab the geojson data.
d3.json(link, (data) => {
  // Create a geoJSON layer with the retrieved data.
  L.geoJson(data, {
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    // Style each feature (in this case an earthquake).
    style: (feature) => {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our earthquake (color based on magnitude).
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: 0.4,
        weight: 1.0,
        radius: markerSize(feature.properties.mag)
      };
    },
    // Called on each feature
    onEachFeature: (feature, layer) => {
      // Set mouse events to change map styling.
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: (event) => {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 40%.
        mouseout: (event) => {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.4
          });
        },
      });
      // Give each feature a pop-up with information pertinent to it.
      layer.bindPopup(
        `<h4>${feature.properties.place}</h4>
        <hr>
        <p>Magnitude: ${feature.properties.mag}</p>
        <p>Date: ${moment(feature.properties.time).format('MMM DD, YYYY hh:mm a')}</p>
      `);

    }
  }).addTo(map);

  // Add legend to bottom right of map.
  const legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {

    const div = L.DomUtil.create('div', 'info legend');
    let labels = ['<strong>Magnitude</strong>'];

    for (let i = 0; i < categories.length; i++) {
      div.innerHTML += labels.push(
        `<div class="circle" style="background:${colors[i]}"></div>${(categories[i] ? categories[i] : '+')}`);
    }
    div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(map);
});