// All earthquakes in the past day.
const earthquakeQueryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
const plateBoundariesJSON = "static/data/PB2002_boundaries.json"
const colors = ['#90EE90', '#FFFF00', '#fed8b1', '#FFA500', '#FF8C00', '#8B0000'];
const categories = ['0-1','1-2','2-3','3-4','4-5', '5+'];

// Perform a GET request to the query URL to get earthquake data.
d3.json(earthquakeQueryURL, (earthquakeData) => {

  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(earthquakeData.features);
});


const createFeatures = (data) => {
  const geojsonMarkerOptions = {
    radius: 8,
    weight: 1,
    opacity: 1,
  };

  // Create a geoJSON layer with the retrieved data.
  const earthquakes = L.geoJson(data, {
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

  })
  // Sending our earthquakes layer to the createMap function.
  createMap(earthquakes);
}


const createMap = (earthquakes) => {

  // Create tectonic plate boundaries layer.
  const platesLayer = new L.layerGroup();
  d3.json(plateBoundariesJSON, (boundaryData) => {
    const plateStyle = (feature) => {
      return {
        weight: 2,
        color: "orange"
      };
    }

    L.geoJSON(boundaryData, {
      style: plateStyle
    }).addTo(platesLayer);
    platesLayer.addTo(map)
  });

  // Define satellite, grayscale, and outdoor layers.
  const satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: process.env.API_KEY
  });

  const grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: process.env.API_KEY
  });

  const outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: process.env.API_KEY
  });

  // Define a baseMaps object to hold our base layers.
  const baseMaps = {
    "Satellite Map": satellite,
    "Grayscale Map": grayscale,
    "Outdoors Map": outdoors
  };

  // Create overlay object to hold our overlay layer.
  const overlayMaps = {
    Earthquakes: earthquakes,
    "Fault Lines": platesLayer
  };

  // Create our map, giving it the satellite and earthquake layers to display on load.
  const map = L.map("map", {
    // Center is at Salt Lake City, UT.
    center: [40.7608, -111.8910],
    zoom: 4,
    layers: [satellite, earthquakes]
  });

  // Create a layer control.
  // Pass in our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // Add legend to bottom left of map.
  const legend = L.control({position: 'bottomleft'});
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
}


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
};