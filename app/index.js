require.paths.unshift(__dirname + '/../vendor');

var connect = require('connect/lib/connect')
  , cacheHeaders = require('./cache_headers')
  , osmProxy = require('./osm_proxy')
  , mxhrTileService = require('./mxhr_tile_service')
  , port = parseInt(process.env.port || 80);

function routes(app) {
  app.get('/tiles/osm/:z/:x/:y.png', function (req, res, next) {
    var z = req.params.z
      , x = req.params.x
      , y = req.params.y;
    osmProxy(z, x, y, req, res, next);
  });
  app.get('/tiles/solanum/many', function (req, res, next) {
    mxhrTileService(req, res, next);
  });
}

function start() {
  connect.createServer(
    connect.logger(),
    cacheHeaders(),
    connect.staticProvider('/home/node/osm_tile_cache'),
    connect.staticProvider(__dirname + '/../public'),
    connect.router(routes)
  ).listen(port);
  console.log('Started in port '+port)
}

module.exports = start;
