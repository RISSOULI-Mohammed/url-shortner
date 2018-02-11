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
app.get("/", function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/:id", function(request, response) {
  var id = Number(request.params["id"]);
  MongoClient.connect("mongodb://omisimo:omisimo@ds229418.mlab.com:29418/shortner", function(err, dbo) {
    if (err) {
      throw err;
    }
    else {
      var db = dbo.db("shortner");
      var coll = db.collection("url");
      coll.find({ _id: id }).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        else if (result.length > 0) {
          var url = result[0].url;
          response.redirect(url);
        }
      });
    }
  });
});

app.get("/new/*", function(request, response) {
  var url = request.originalUrl;
  url = url.replace("/new/", "");
  var reg = /\w*:\/\/\w+\.\w+\.?[\w|:]*/i;
  if (reg.exec(url) !== null) {
    var id = 0;
    MongoClient.connect("mongodb://omisimo:omisimo@ds229418.mlab.com:29418/shortner", function(err, dbo) {
      if (err) {
        throw err;
      }
      else {
        var db = dbo.db("shortner");
        var coll1 = db.collection("counters");
        coll1.findAndModify({ _id: "urlid" }, [
            ['_id', 'asc']
          ], { $inc: { sequence_value: 1 } }, {},
          function(err, object) {
            if (err) throw err;
            id = object.value.sequence_value;
            var doc = { "_id": id, "url": url };
            //var doc = {"url": url};
            var coll = db.collection("url");
            coll.insert(doc, function(err, data) {
              if (err) {
                throw err;
              }
              else {
                var output = {
                  "original_url": url,
                  "short_url": "https://best-donkey.glitch.me/" + id
                };
                response.end(JSON.stringify(output));
                //dbo.close();
              }
            });
          }
        );
      }
    });
  }
  else {
    var output = { "Error": "Invalid URL" };
    response.end(JSON.stringify(output));
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
