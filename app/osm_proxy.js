var http = require('http');

module.exports = function(z, x, y, req, res, callback) {
  var upstream = http.createClient(80, 'tile.openstreetmap.org');
  var upstreamReq = upstream.request('GET', '/'+z+'/'+x+'/'+y+'.png', {
    'User-Agent': 'Caching tile proxy for application http://teropa.no.de/'
  });
  upstreamReq.on('response', function(upstreamRes) {
    console.log('got res');
    upstreamRes.on('data', function(chunk) {
      console.log('got chunk');
      res.write(chunk, 'binary');
    });
    upstreamRes.on('end', function() {
      console.log('got end');
      res.end();
      callback();
    });
    res.writeHead(upstreamRes.statusCode, upstreamRes.headers);
  });
  upstreamReq.end();
};
