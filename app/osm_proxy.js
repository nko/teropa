var http = require('http')
  , fs = require('fs')
  , sys = require('sys')
  , tileOminouser = require('./tile_ominouser')
  , tileWriter = require('./osm_tile_writer')
  , clients = [http.createClient(80, 'tile.openstreetmap.org'),
               http.createClient(80, 'tile.openstreetmap.org')];

// Restrict to two concurrent clients to comply with OSM policy (http://wiki.openstreetmap.org/wiki/Tile_usage_policy)

function reserveClient(callback) {
  if (clients.length > 0) {
    callback(clients.shift());
  } else {
    process.nextTick(function() {
      reserveClient(callback);
    });
  }
}

function releaseClient(client) {
  clients.push(client);
}

module.exports = function(z, x, y, req, res, callback) {
  if (parseInt(x) > Math.pow(2, parseInt(z)) - 1 || parseInt(y) > Math.pow(2, parseInt(z)) - 1) {
    console.log('disregarding nonexisting tile: '+z+'/'+x+'/'+y);
    res.writeHead(404);
    res.end();
  } else {
    console.log('requesting OSM tile from backend: '+z+'/'+x+'/'+y);
    reserveClient(function (client) {
      var upstreamReq = client.request('GET', '/'+z+'/'+x+'/'+y+'.png', {
        'User-Agent': 'Caching tile proxy for application http://teropa.no.de/'
      });
      
      upstreamReq.on('response', function(upstreamRes) {
        var chunks = [];
        upstreamRes.on('data', function(chunk) {
          chunks.push(chunk);
        });
        upstreamRes.on('end', function() {
          releaseClient(client);
  
          var tmpFile = '/home/node/tmp/solanum_tile_'+(Math.random() * new Date().getTime()+".png");
          var out = fs.createWriteStream(tmpFile);
          var w = function() {
            if (chunks.length > 0) {
              if (out.write(chunks.shift())) {
                w();
              } else {
                var l = function() {
                  out.removeListener('drain', l);
                  w();
                }
                out.addListener('drain', l);
              }
            } else {
              out.end();
              tileOminouser(tmpFile, function(err) {
                if (err) {
                  res.writeHead(500);
                  res.end();
                } else {
                  var finalStream = fs.createReadStream(tmpFile);
                  res.writeHead(upstreamRes.statusCode, { "Content-Length": fs.statSync(tmpFile).size });
                  finalStream.on('data', function(chunk) {
                    res.write(chunk, 'binary');
                  });
                  finalStream.on('end', function() {
                    res.end();
                    process.nextTick(function() {
                      tileWriter(tmpFile, z, x, y);
                    })
                  });
                }
              });    
            }
          }
          w();
          
        });
      });
      upstreamReq.end();
    });
  }
};
