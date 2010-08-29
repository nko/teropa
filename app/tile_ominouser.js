var gm = require('gm');

module.exports = function(file, callback) {
  gm(file)
    .colorspace('GRAY')
    .write(file, callback);
};
