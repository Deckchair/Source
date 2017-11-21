# OSMBuildings Source

This enables simple access to OSM Buildings (https://osmbuildings.org/) data by given bounding box.
The area is split into tiles and downloaded in parallel.

Don't forget to sign up four your personal key!
https://osmbuildings.org/account/register/


## Example browser

Setup

~~~html
<!DOCTYPE html>
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

## Example NodeJS

Setup

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