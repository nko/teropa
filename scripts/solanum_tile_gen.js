// Generates OSM-compatible tile images from the KML files exported from STEM

require.paths.unshift(__dirname + '/../vendor');

var fs = require('fs')
  , sys = require('sys')
  , spawn = require('child_process').spawn
  , xml = require('node-xml/lib/node-xml')
  , tileInit = require('./tile_init')
  , util = require('./util');

var destPath = __dirname + '/../public/tiles/solanum';
var levels = [1, 2, 3, 4, 5, 6, 7];
var tileSize = 256;
var worldBounds = [-2.0037508342789244E7, -2.0037508342789244E7, 2.0037508342789244E7, 2.0037508342789244E7];

var file = __dirname + '/../data/control_00020_I.kml';

function writePolygon(out, polygon, style) {
  polygon = projectPolygon(polygon);
  for (var z=0 ; z<1 ; z++) {
    var gridSize = Math.pow(2, levels[z]);
    var pixelSize = gridSize * tileSize;
    var polygonPixels = util.translatePolygonToPixels(polygon, worldBounds, pixelSize);
    var polygonBbox = util.getPolygonBBox(polygonPixels);
    for (var x=0 ; x<gridSize ; x++) {
      for (var y=0 ; y<gridSize ; y++) {
        var bbox = [x*tileSize, y*tileSize, (x+1)*tileSize, (y+1)*tileSize];
        if (util.intersection(polygonBbox, bbox)) {
          var pixelsInThisTile = []
          for (var i=0 ; i<polygonPixels.length ; i++) {
            pixelsInThisTile.push([
              Math.round(polygonPixels[i][0] - x * tileSize),
              Math.round(polygonPixels[i][1] - y * tileSize)
            ]);
          }          
          out.write(destPath + '/'+levels[z]+'/'+x+'/'+y+'.png '+pixelsInThisTile+"\n");
        }
      }
    }
  }
}

function projectPolygon(poly) {
  var lon
    , lat 
    , res = []
    , i = 0;
  for (; i<poly.length ; i++) {
    lon = util.toRad(poly[i][0]);
    lat = util.toRad(poly[i][1]);
    res.push(util.projectToGoogleMercator(lon, lat));
  }
  return res;
}

function parsePolygon(str) {
  var pts = str.split(' ')
    , res = []
    , i = 0;
  for (; i<pts.length ; i++) {
    if (pts[i].length > 0) {
      res.push(pts[i].split(','));
    }
  }
  return res;
}

function writePolygonInfo(out, callback) {
  var parser = new xml.SaxParser(function (cb) {
    var inPlacemark, currChars, currStyle;
    
    cb.onStartElementNS(function(elem, attrs, prefix, uri, namespace) {
      currChars = '';
      if ('Placemark' === elem) {
        inPlacemark = true;
      }
    });
    cb.onEndElementNS(function(elem, prefix, uri) {
      if ('styleUrl' === elem && inPlacemark) {
        currStyle = currChars;
      } else if ('coordinates' === elem && inPlacemark) {
        writePolygon(out, parsePolygon(currChars), currStyle);
      } else if ('Placemark' === elem) {
        inPlacemark = false;
      } else if ('kml' === elem) {
        callback();
      }
    });
    cb.onCharacters(function(chars) {
      currChars += chars;
    });
    cb.onError(function(error) {
      callback(error);
    });
  });
  console.log('Starting parser for '+file);
  parser.parseFile(file);
}

tileInit(destPath, levels, function(err) {
  if (err) console.log(err);
  else {
    var out = fs.createWriteStream("/tmp/tiles.txt");
    writePolygonInfo(out, function(err) {
      if (err) console.log(err);
      else {
        out.end();
        console.log('Passing the torch to Clojure')
        var clj = spawn('clj', [__dirname + '/draw_tiles.clj', '/tmp/tiles.txt'])
        clj.on('exit', function(code) {
          console.log('clj exited with code ' + code);
        });
      }
    });
  }
});

