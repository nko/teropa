var url = require('url')
  , fs = require('fs')
  , base64 = require('base64')
  , baseDir = '/home/node/osm_tile_cache/tiles/solanum';

function parseTiles(parms) {
  var tiles = []
    , i = 0
    , value;
  for (; i<parms.length ; i++) {
    if (parms[i].indexOf('=') > -1) {
      value = parms[i].substring(parms[i].indexOf('=') + 1);
      tiles.push(value.split(','));
    }
  }
  return tiles;
}

module.exports = function(req, res, callback) {
  var qry = url.parse(req.url).query
    , parms = qry.split("&")
    , tiles = parseTiles(parms)
    , writeNext;
  
  res.writeHead(200, {
    'MIME-Version': '1.0',
    'Content-Type': 'multipart/mixed; boundary="|||"',
    'Cache-Control': 'public, max-age=31536000'
  });
  
  writeNext = function() {
    var tile, t, z, x, y;
    
    if (tiles.length == 0) {
      res.end('\n--|||--\n');
      callback();
    } else {
      tile = tiles.shift();
      t = tile[0], z = tile[1], x = tile[2], y = tile[3];
      fs.readFile(baseDir + '/' + t + '/' + z + '/' + x + '/' + y + '.png', function(err, data) {
        if (err) {
          console.log(err);
          writeNext();
        } else {
          var encoded = base64.encode(data);
          
          res.write('\n--|||\n');
          res.write('Content-Type: image/png\n');
          res.write(encoded);
          
          writeNext();
        }
      });
      
    }
  };
  writeNext();
  
};