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

app.get("/new/*", function(request, response){
  var url = request.originalUrl;
  url = url.replace("/new/", "");
  MongoClient.connect("mongodb://omisimo:omisimo@ds229418.mlab.com:29418/shortner", function (err, dbo) {
  if (err) {
    throw err;
  } else {
    var db = dbo.db("shortner");
    var coll1 = db.collection("counters")
    var sequenceDocument = coll1.findAndModify({
      query:{_id: "urlid" },
      update: {$inc:{sequence_value:1}},
      update:true
   });
	
   var id = sequenceDocument.sequence_value;
    var doc = {"_id": id, "url": url};
    var coll = db.collection("url");
    coll.insert(doc, function(err, data){
      if (err) {
    throw err;
  } else {
    response.end(JSON.stringify(data));
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
