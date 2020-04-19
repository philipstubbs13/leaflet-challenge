# Leaflet Challenge

This repository includes a map visualization showing earthquakes from the past 7 days using [earthquake geojson data](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson) from the United States Geological Survey. The map was built using the [Leaflet](https://leafletjs.com/) JavaScript library.

This repository includes two different levels of maps:

## Level 1

The first level is inside the [Leaflet-Step-1](./Leaflet-Step-1) folder of this repository. This map shows all earthquakes from the past 7 days. The data markers reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes appear larger and darker in color. A legend is available to provide additional context for the map data. Clicking a marker opens a popup that includes the location, magnitude, and date for the earthquate that was clicked.

To run this map locally:

1. Download or clone this repository to a local directory on your computer.
2. Create an account on [mapbox](https://account.mapbox.com/) and obtain a free API key.
3. Inside the **leaflet-challenge/Leaflet-Step-1/static/js** folder, create a file called **config.js** and add the following lines to that file:

```bash
// API key
const config = {
  API_KEY : "YOUR_API_KEY",
}
```

Replace YOUR_API_KEY with your actual api key obtained in step 2.<br>
4. Open up the **leaflet-challenge/Leaflet-Step-1/index.html** file in Chrome to see the map.

## Level 2

The second level is inside the [Leaflet-Step-2](./Leaflet-Step-2) folder of this repository. This map includes the same features and shows the same data as level 1 but also includes a second data set to illustrate the relationship between tectonic plates and seismic activity. The data for the tectonic plates was obtained from [here](https://github.com/fraxen/tectonicplates).

This map includes three base maps you can choose from in the upper right corner of the map (satellite, grayscale, and outdoors). The map also includes 2 overlay maps that you can toggle on and off (earthquakes and fault lines). And just like level 1, each marker reflects the magnitude of the earthquake in size and color.

To run this map locally:

1. Download or clone this repository to a local directory on your computer.
2. Create an account on [mapbox](https://account.mapbox.com/) and obtain a free API key (or use the same api key used for the level 1 map).
3. Inside the **leaflet-challenge/Leaflet-Step-2/static/js** folder, create a file called **config.js** and add the following lines to that file:

```bash
// API key
const config = {
  API_KEY : "YOUR_API_KEY",
}
```

Replace YOUR_API_KEY with your actual api key obtained in step 2.<br>
4. Open up the **leaflet-challenge/Leaflet-Step-2/index.html** file in Chrome to see the map.
