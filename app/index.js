require.paths.unshift(__dirname + '/../vendor');
var connect = require('connect/lib/connect');

function start() {
  connect.createServer(
    connect.logger(),
    connect.staticProvider(__dirname + '/../public')
  ).listen(8124);
  console.log('Started')
}

module.exports = start;
