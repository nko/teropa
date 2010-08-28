// Generates OSM-compatible tile images from the KML files exported from STEM

require.paths.unshift(__dirname + '/../vendor');

var fs = require('fs')
  , xml = require('node-xml/lib/node-xml')
  , tileInit = require('./tile_init')
  , util = require('./util');

var destPath = __dirname + '/../public/tiles/solanum';
var levels = [1, 2, 3, 4, 5, 6, 7];

var file = __dirname + '/../data/control_00020_I.kml';

function drawPolygon(polygon, style, callback) {
  polygon = projectPolygon(polygon);
  console.log(polygon);
  callback();
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
    res.push(pts[i].split(','));
  }
  return res;
}

function drawTiles() {
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
        parser.pause();
        drawPolygon(parsePolygon(currChars), currStyle, function(err) {
          if (err) throw err;
          parser.resume();
        });
      } else if ('Placemark' === elem) {
        inPlacemark = false;
      }
    });
    cb.onCharacters(function(chars) {
      currChars += chars;
    });
    
  });
  console.log('Starting parser for '+file);
  parser.parseFile(file);
}

tileInit(destPath, levels, function(err) {
  if (err) console.log(err);
  else {
    drawTiles();
  }
});

