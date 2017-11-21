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
