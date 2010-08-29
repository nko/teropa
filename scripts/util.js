var fs = require('fs');

function cp(from, to, callback) {
  fs.readFile(from, 'binary', function(err, buf) {
    if (err) return callback(err)
    fs.writeFile(to, buf, 'binary', callback)
  })
}

function toRad(deg) {
  return deg * (2 * Math.PI) / 360;
}

function sign(num) {
  return num < 0 ? -1 : 1;
}

function lonRadToDeg(lon) {
  return Math.abs(lon) < Math.PI ? lon : (lon - (sign(lon) * Math.PI * 2));
}

function projectToGoogleMercator(lon, lat) {
  if (Math.abs(Math.abs(lat) - Math.PI / 2) <= 1.0e-10) {
    throw new "Transformation cannot be computed at the poles";
  }
  
  var x = 6378137 * lonRadToDeg(lon);
  var y = 6378137 * Math.log(Math.tan(Math.PI / 4 + 0.5 * lat));
  
  return [x, y];
}

function wrapsDateLine(polygon, worldBounds) {
  var worldWidth = worldBounds[2] - worldBounds[0];
  var prev = polygon[0][0];
  for (var i=1 ; i<polygon.length ; i++) {
    var dist = polygon[i][0] - prev;
    if (Math.abs(dist) > worldWidth / 2) {
      return true;
    }
  }
  return false;
}

function translatePolygonToPixels(polygon, bounds, pixelSize) {
  
  var res = [];
  
  var boundsWidth = bounds[2] - bounds[0];
  var boundsHeight = bounds[3] - bounds[1];
  var widthRatio = pixelSize / boundsWidth;
  var heightRatio = pixelSize / boundsHeight;
  
  for (var i=0 ; i<polygon.length ; i++) {
    var pt = polygon[i];
    var fromLeft = pt[0] - bounds[1];
    var fromTop = bounds[3] - pt[1];
    res.push([fromLeft * widthRatio, fromTop * heightRatio]);
  }
  return res;
}

function getPolygonBBox(polygon) {
  var minX = Number.MAX_VALUE
    , minY = Number.MAX_VALUE
    , maxX = Number.MIN_VALUE
    , maxY = Number.MIN_VALUE;
  
  for (var i=0 ; i<polygon.length ; i++) {
    var pt = polygon[i];
    if (pt[0] < minX) minX = pt[0];
    if (pt[0] > maxX) maxX = pt[0];
    if (pt[1] < minY) minY = pt[1];
    if (pt[1] > maxY) maxY = pt[1];
  }
  
  return [minX, minY, maxX, maxY];
}

function intersection(lhs, rhs) {
  return lhs[0] < rhs[2] && lhs[2] > rhs[0] && lhs[1] < rhs[3] && lhs[3] > rhs[1];  
}

module.exports = {
  cp: cp
 ,toRad: toRad
 ,projectToGoogleMercator: projectToGoogleMercator
 ,translatePolygonToPixels: translatePolygonToPixels
 ,getPolygonBBox: getPolygonBBox
 ,intersection: intersection
 ,wrapsDateLine: wrapsDateLine
};
