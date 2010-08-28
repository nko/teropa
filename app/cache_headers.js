module.exports = function setCacheHeaders() {
  return function(req, res, next) {
    var writeHead = res.writeHead;
    
    res.writeHead = function(code, headers) {
      res.writeHead = writeHead;
      
      if (req.url.indexOf('.nocache.') > -1) {
        headers['Cache-Control'] = 'no-cache, no-store';
      }
      
      res.writeHead(code, headers);
    };
    
    next();
  }
}