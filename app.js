var _ = require('lodash')
  , express = require('express')
  , request = require('request')
  , cheerio = require('cheerio')
  , port    = process.env.PORT || 8888;

var app = module.exports = express();
app.use(express.static(__dirname + '/public'));

app.get('/api', function(req, res) {
  request.get({
    uri : req.query.uri,
    followAllRedirects : true
  }, function(error, response, body) {
    if (error) 
      return res.json(400, error);

    if (req.query.redirects) {
      return res.json(response.request.redirects);
    }

    res.json(_.compact(cheerio.load(body, { 
      lowerCaseTags : true 
    })('a').map(function() {
      return this.attr('href')
    })));
  })
});

app.listen(port, function() {
  console.log('Listening on :%d', port);
});