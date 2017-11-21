
if (typeof OSMBuildings === 'undefined') {
  var OSMBuildings = {};
}

if (typeof module === 'object') {
  module.exports = OSMBuildings;
  var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

(function() {

  var url = 'https://{s}.data.osmbuildings.org/0.2/{k}/tile/15/{x}/{y}.json';
  var fixedZoom = 15;
  var tiles = {};
  var buffer = 1;

  function ajax(url, onSuccess, onError) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
      if (req.readyState !== 4) {
        return;
      }

      if (!req.status || req.status < 200 || req.status > 299) {
        return;
      }

      if (!req.responseText) {
        onError();
        return;
      }
      var json;
      try {
        json = JSON.parse(req.responseText);
      } catch(ex) {}
      if (!json) {
        onError();
        return;
      }
      onSuccess(json);
    };

    req.open('GET', url);
    req.send(null);

    return req;
  }

  function getDistance(a, b) {
    var dx = a[0]-b[0], dy = a[1]-b[1];
    return dx*dx + dy*dy;
  }

  function geoToPixel(lon, lat) {
    var
      y = Math.min(1, Math.max(0, 0.5 - (Math.log(Math.tan(Math.PI/4 + Math.PI/2 * lat / 180)) / Math.PI) / 2)),
      x = lon/360 + 0.5,
      scale = 1 << fixedZoom;
    return [x * scale <<0, y * scale <<0];
  }

  function purge(min, max) {
    var pos;
    for (var key in tiles) {
      pos = key.split(',');
      if (pos[0] < min[0]-buffer || pos[0] > max[0]+buffer || pos[1] < min[1]-buffer || pos[1] > max[1]+buffer) {
        if (tiles[key].req) {
          tiles[key].req.abort();
        }
        delete tiles[key];
      }
    }
  }

  function mergeGeoJSON(collections) {
    var res = { type: 'FeatureCollection', features: [] };
    collections.forEach(function(item) {
      res.features = res.features.concat(item.features);
    });
    return res;
  }

  //*******************************************************

  OSMBuildings.Source = function(options) {
    options = options || {};
    buffer = options.buffer || buffer;
    url = (options.url || url).replace('{k}', (options.key || 'anonymous'));
  };

  OSMBuildings.Source.ATTRIBUTION = '© Data Service <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>';

  OSMBuildings.Source.prototype.getAllTiles = function(minX, minY, maxX, maxY, callbackAll, callbackTile) {
    var
      min = geoToPixel(minX, maxY),
      max = geoToPixel(maxX, minY),
      center = [min[0] + (max[0]-min[0])/2, min[1] + (max[1]-min[1])/2],
      x, y,
      key,
      queue = [],
      res = [];

    for (y = min[1]; y <= max[1]; y++) {
      for (x = min[0]; x <= max[0]; x++) {
        key = x + ',' + y;
        if (tiles[key]) {
          res.push(tiles[key].json);
        } else {
          queue.push({ x: x, y: y, key: key, dist: getDistance([x, y], center) });
        }
      }
    }

		queue.sort(function(a, b) {
			return a.dist - b.dist;
		});

    var remaining = queue.length;
		queue.forEach(function(tile) {
      var s = 'abcd'[(tile.x+tile.y) % 4];
      var u = url.replace('{s}', s).replace('{x}', tile.x).replace('{y}', tile.y).replace('{z}', fixedZoom);

      tiles[tile.key] = {};
      tiles[tile.key].req = ajax(u, function(json) { // success
        remaining--;
        callbackTile && callbackTile(tile.x, tile.y, fixedZoom, json);
        tiles[tile.key].json = json;
        res.push(json);
        delete tiles[tile.key].req;
        if (!remaining) {
          callbackAll && callbackAll(mergeGeoJSON(res));
        }
      }, function() { // error
        remaining--;
        delete tiles[tile.key];
        if (!remaining) {
          callbackAll && callbackAll(mergeGeoJSON(res));
        }
      });
		});

    purge(min, max);

    return {
      abort: function() {
        for (var key in tiles) {
          if (tiles[key].req) {
            tiles[key].req.abort();
            delete tiles[key].req;
          }
        }
      }
    };
  };

}());
