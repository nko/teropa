// Generates OSM-compatible tile images from the KML files exported from STEM

require.paths.unshift(__dirname + '/../vendor');

var fs = require('fs')
  , sys = require('sys')
  , spawn = require('child_process').spawn
  , expat = require('node-expat')
  , tileInit = require('./tile_init')
  , util = require('./util');

var srcPath = __dirname + '/../data';
var destPath = __dirname + '/../public/tiles/solanum';

var levels = [1, 2, 3, 4, 5, 6, 7];
var tileSize = 256;
var worldBounds = [-2.0037508342789244E7, -2.0037508342789244E7, 2.0037508342789244E7, 2.0037508342789244E7];

var styles = {
    "#Style1": "96 0 0 180",
    "#Style2": "128 0 0 180",
    "#Style3": "149 0 0 180",
    "#Style4": "160 0 0 180",
    "#Style5": "176 0 0 180"
};



function writePolygon(out, polygon, t, style) {
  polygon = projectPolygon(polygon);
  
  for (var z=0 ; z<levels.length ; z++) {
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
          out.write(destPath+'/'+t+'/'+levels[z]+'/'+x+'/'+y+'.png '+(styles[style] || styles['#Style1'])+' '+pixelsInThisTile+"\n");
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

function writePolygonInfo(fileName, t, out, callback) {
  var parser = new expat.Parser("UTF-8");
  var inPlacemark, currChars, currStyle, cnt = 0;

  parser.addListener('startElement', function(elem, attrs) {
    currChars = '';
    if ('Placemark' === elem) {
      inPlacemark = true;
    }
  });
  parser.addListener('endElement', function(elem) {
    if ('styleUrl' === elem && inPlacemark) {
      currStyle = currChars;
    } else if ('coordinates' === elem && inPlacemark) {
      writePolygon(out, parsePolygon(currChars), t, currStyle);
      console.log('polygon '+(++cnt));
    } else if ('Placemark' === elem) {
      inPlacemark = false;
    } else if ('kml' === elem) {
      callback();
    }
  });
  parser.addListener('text', function(chars) {
    currChars += chars;
  });
  console.log('Starting parser for '+fileName);
  var stream = fs.createReadStream(fileName);
  stream.addListener('data', function(data) {
    parser.parse(data, false);    
  });
}

var files = fs.readdirSync(srcPath);
for (var i=files.length - 1 ; i>=0 ; i--) {
  if (!files[i].match(/\.kml$/)) {
    files.splice(i, 1);
  } else {
    files[i] = srcPath + '/' + files[i];
  }
}
/*tileInit(destPath, levels, files.length, function(err) {
  if (err) console.log(err);
  else {*/
    var t = 0;
    var genNext = function() {
      if (files.length == 0) return;
      var file = files.shift();
      if (file === 'README.md') { 
        genNext();
      } else {
        var tmpFileName = "/tmp/tiles_"+files.length+"_.txt";
        var out = fs.createWriteStream(tmpFileName);
        console.log('Processing '+file+' (tmp: '+tmpFileName+')');
        writePolygonInfo(file, t, out, function(err) {
          if (err) console.log(err);
          else {
            out.end();
            console.log('Passing the torch to Clojure')
            var clj = spawn('clj', [__dirname + '/draw_tiles.clj', tmpFileName])
            clj.on('exit', function(code) {
              console.log('clj exited with code ' + code);
              t++;
              genNext();
            });
          }
        });
      }
    }
    
    genNext();
/*  }
});*/

