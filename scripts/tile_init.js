var fs = require('fs')
  , util = require('./util');

var blankTile = __dirname + '/blank_tile.png';

function mkTileDirs(destPath, numTs, levels) {
  var t, z, x, y, size;
  fs.mkdirSync(destPath, 0777);
  for (t = 0 ; t<numTs ; t++) {
    fs.mkdirSync(destPath + '/' + t, 0777);
    for (z = 0 ; z<levels.length ; z++) {
      size = Math.pow(2, levels[z]);
      fs.mkdirSync(destPath + '/' + t + '/' + levels[z], 0777);
      for (x = 0 ; x<size ; x++) {
        fs.mkdirSync(destPath + '/' + t + '/' + levels[z] + '/' + x, 0777);
      }
    }
  }
}

module.exports = function(destPath, levels, numTs, callback) {
  var t = 0
    , z = 0
    , x = 0
    , y = 0;

  mkTileDirs(destPath, numTs, levels);

  var writeNext = function() {
    var tile = destPath + '/' + t + '/' + levels[z] + '/' + x + '/' + y + '.png';
    
    util.cp(blankTile, tile, function(err) {
      if (err) callback(err);
      else {
        var currentSize = Math.pow(2, levels[z]);
        if (y == currentSize - 1) {
          if (x == currentSize - 1) {
            if (z == levels.length - 1) {
              if (t == numTs - 1) {
                callback();
              } else {
                t++;
                x = y = z = 0;
                writeNext();
              }
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
