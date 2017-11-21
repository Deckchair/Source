# OSMBuildings Source

This enables simple access to OSM Buildings (https://osmbuildings.org/) data by given bounding box.
The area is split into tiles and downloaded in parallel.

*Sign up four your personal key:* https://osmbuildings.org/account/register/

## API

### Class OSMBuildings.Source({ options })

*Parameters*

`options` {Object}

`options.url` {String} data URL schema - optional

`options.key` {String} your personal key, sign up here: https://osmbuildings.org/account/register/

`options.buffer` {Integer} a buffer around requested area, this extends caching - optional


### Method getAllTiles(minX, minY, maxX, maxY, onBBoxLoaded, onTileLoaded)

*Parameters*

`minX, minY, maxX, maxY` {Float} bounding box in geo coordinates (EPSG:4326)

`onBBoxLoaded(json)` {Function} is called when all tiles are loaded, receives entire geojson

`onTileLoaded(x, y, zoom, json)` {Function} is called on every tile arrival, receives tile coordinates x, y, zoom and geojson


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

function onBBoxLoaded(json) {
  console.log('BBOX', json.features.length);
}

function onTileLoaded(x, y, zoom, json) {
  console.log('TILE', x, y, zoom, json.features.length);
}

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

function onBBoxLoaded(json) {
  console.log('BBOX', json.features.length);
  var fs = require('fs');
  fs.writeFileSync('data.json', JSON.stringify(json));
}

function onTileLoaded(x, y, zoom, json) {
  console.log('TILE', x, y, zoom, json.features.length);
}

var src = new OSMBuildings.Source();
src.getAllTiles(minX, minY, maxX, maxY, onBBoxLoaded, onTileLoaded);
~~~


## License

MIT