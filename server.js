// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/new/:url", function(request, response){
  var url = request.params["url"];
  var doc = {};
  MongoClient.connect("mongodb://omisimo:omisimo@ds229418.mlab.com:29418/", function (err, dbo) {
  if (err) {
    throw err;
  } else {
    var db = dbo.db("shortner");
    var coll = db.collection("url");
    coll.insert(doc, function(err, data){
      if (err) {
    throw err;
  } else {
    response.end(url);
  }
    });
    dbo.close();
  }
});
  //response.end(client.urlshortner(request.params["url"]));
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
