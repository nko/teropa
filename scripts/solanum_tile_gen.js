// Generates OSM-compatible tile images from the KML files exported from STEM

require.paths.unshift(__dirname + '/../vendor');
var fs = require('fs')
  , xml = require('node-xml/lib/node-xml')
  , util = require('./util');

var blankTile = __dirname + '/blank_tile.png';
var destPath = __dirname + '/../public/tiles/solanum';

var levels = [1, 2, 3, 4, 5, 6, 7];

function mkTileDirs() {
  var z, x, y, size;
  fs.mkdirSync(destPath, 0777);
  for (z = 0 ; z<levels.length ; z++) {
    size = Math.pow(2, levels[z]);
    fs.mkdirSync(destPath + '/' + levels[z], 0777);
    for (x = 0 ; x<size ; x++) {
      fs.mkdirSync(destPath + '/' + levels[z] + '/' + x, 0777);
    }
  }
}

function initEmptyTiles(callback) {
  var z = 0
    , x = 0
    , y = 0;

  mkTileDirs();

  var writeNext = function() {
    var tile = destPath + '/' + levels[z] + '/' + x + '/' + y + '.png';
    util.cp(blankTile, tile, function(err) {
      if (err) callback(err);
      else {
        var currentSize = Math.pow(2, levels[z]);
        if (y == currentSize - 1) {
          if (x == currentSize - 1) {
            if (z == levels.length - 1) {
              callback();
            } else {
              z++;
              x = y = 0;
              writeNext();
            }
          } else {
            x++
            y = 0;
            writeNext();
          }
        } else {
          y++;
          writeNext();
        }
      }
    });
  };
  
  writeNext();
}

initEmptyTiles(function(err) {
  console.log(err);
});

