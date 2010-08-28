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

  
module.exports = {cp: cp, toRad: toRad, projectToGoogleMercator: projectToGoogleMercator};
