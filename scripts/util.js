var fs = require('fs');

function cp(from, to, callback) {
  fs.readFile(from, 'binary', function(err, buf) {
    if (err) return callback(err)
    fs.writeFile(to, buf, 'binary', callback)
  })
}

module.exports = {cp: cp};
