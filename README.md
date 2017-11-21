# OSMBuildings Source

This enables simple access to OSM Buildings (https://osmbuildings.org/) data by given bounding box.
The area is split into tiles and downloaded in parallel.

*Sign up four your personal key:* https://osmbuildings.org/account/register/

## API

Class ´OSMBuildings.Source({ options })´

Parameter ´options = {
  url: {String}, // data URL schema - optional
  key: {String}, // your personal key, sign up here: https://osmbuildings.org/account/register/
  buffer: {Integer} // a buffer around requested area, this extends caching - optional
}´

Method ´getAllTiles(minX, minY, maxX, maxY, onBBoxLoaded, onTileLoaded)´`

Parameters ´minX, minY, maxX, maxY {Float} // these represent the bounding box in geo coordinates (EPSG:4326)´

Parameter ´onTileLoaded(x, y, z, json) // a function that is called on every tile arrival, provides tile coordinates and geojson´

Parameter ´onBBoxLoaded(json) // a function that is called when all tiles are loaded, provides entire geojson´


## Example for Browser

Setup

~~~html
<script src="OSMBuildings.Source.js"></script>
~~~

Usage

~~~js
var minX = 13.3863;
var minY = 52.5131;
var maxX = 13.4146;
var maxY = 52.5237;

function onTileLoaded(x, y, z, json) {
  console.log('TILE', x, y, z, json.features.length);
}

function onBBoxLoaded(json) {
  console.log('BBOX', json.features.length);
}

// options: buffer, url, key
var src = new OSMBuildings.Source();
src.getAllTiles(minX, minY, maxX, maxY, onBBoxLoaded, onTileLoaded);
~~~

## Example for NodeJS

Setup

Dependencies: XMLHttpRequest

~~~js
npm install
~~~

Usage

~~~js
var OSMBuildings = require('./OSMBuildings.Source.js');

var minX = 13.3863;
var minY = 52.5131;
var maxX = 13.4146;
var maxY = 52.5237;

function onTileLoaded(x, y, z, json) {
  console.log('TILE', json.features.length);
}

function onBBoxLoaded(json) {
  console.log('BBOX', json.features.length);
  var fs = require('fs');
  fs.writeFileSync('data.json', JSON.stringify(json));
}

// options: buffer, url, key
var src = new OSMBuildings.Source();
src.getAllTiles(minX, minY, maxX, maxY, onBBoxLoaded, onTileLoaded);
~~~


## License

MIT