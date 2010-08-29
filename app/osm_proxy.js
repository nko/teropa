var http = require('http')
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
  reserveClient(function (client) {
    var upstreamReq = client.request('GET', '/'+z+'/'+x+'/'+y+'.png', {
      'User-Agent': 'Caching tile proxy for application http://teropa.no.de/'
    });
    upstreamReq.on('response', function(upstreamRes) {
      upstreamRes.on('data', function(chunk) {
        res.write(chunk, 'binary');
      });
      upstreamRes.on('end', function() {
        res.end();
        releaseClient(client);
        callback();
      });
      res.writeHead(upstreamRes.statusCode, upstreamRes.headers);
    });
    upstreamReq.end();    
  });
};
