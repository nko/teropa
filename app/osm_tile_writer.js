var fs = require('fs')
  , path = require('path')
  , baseDir = '/home/node/osm_tile_cache/tiles/osm'
  , mutex = 'mutex';

function obtainMutex(cb) {
  if (mutex) {
    mutex = null;
    cb();
  } else {
    process.nextTick(function() {
      obtainMutex(cb);
    });
  }
}

function releaseMutex() {
  mutex = 'mutex';
}

module.exports = function(tmpFile, z, x, y) {
  obtainMutex(function() {
    path.exists(baseDir+'/'+z, function(exists) {
      if (!exists) fs.mkdirSync(baseDir+'/'+z, 0777);
      path.exists(baseDir+'/'+z+'/'+x, function(exists) {
        if (!exists) fs.mkdirSync(baseDir+'/'+z+'/'+x, 0777);
        path.exists(baseDir+'/'+z+'/'+x+'/'+y+'.png', function(exists) {
          if (!exists) {
            fs.rename(tmpFile, baseDir+'/'+z+'/'+x+'/'+y+'.png', function() {
              releaseMutex();
            });
          } else {
            releaseMutex();
          }
        });
      });
    });    
  })
}
