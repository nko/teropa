require.paths.unshift(__dirname + '/../vendor');

var connect = require('connect/lib/connect')
  , cacheHeaders = require('./cache_headers');

function start() {
  var port = parseInt(process.env.port || 80);
  connect.createServer(
    connect.logger(),
    cacheHeaders(),
    connect.staticProvider(__dirname + '/../public')
  ).listen(port);
  console.log('Started in port '+port)
}

module.exports = start;
