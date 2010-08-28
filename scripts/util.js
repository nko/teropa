var sys = require('sys')
  , fs = require('fs');

// Grabbed from http://github.com/aheckmann/utils/blob/master/cp.js
function cp(from, to, callback){
  if (!to) return error("cp: `to` must be defined", callback)
  if (!from) return error("cp: `from` must be defined", callback)
  var read = fs.createReadStream(from)
    , write = fs.createWriteStream(to)
    , failout = function(err){
        if ("function" == typeof read.destroy) read.destroy()     
        if ("function" == typeof write.destroy) write.destroy()
        callback(err);
      }
    ;

  read.on("error", failout)
  write.on("error", failout)
  sys.pump(read, write, callback)
}

module.exports = {cp: cp};
