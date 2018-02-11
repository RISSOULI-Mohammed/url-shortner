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

app.get("/new/*", function(request, response) {
    var url = request.originalUrl;
    url = url.replace("/new/", "");
    var reg = /(\w)*(:\/\/)(\w)*.(\w|-)+.(\w)+/i;
    if(url.match(url, reg) == null){
      var output = {"Error": "Invalid URL"};
      response.end(JSON.stringify(output));
    }

    var id = 0;
    MongoClient.connect("mongodb://omisimo:omisimo@ds229418.mlab.com:29418/shortner", function(err, dbo) {
        if (err) {
            throw err;
        }
        else {
            var db = dbo.db("shortner");
            var coll1 = db.collection("counters")
            var sequence = coll1.findAndModify({ _id: "urlid" }, [
                    ['_id', 'asc']
                ], { $inc: { sequence_value: 1 } }, {},
                function(err, object) {
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
                        }
                    });
                }
            );



        }
    });


    //response.end(client.urlshortner(request.params["url"]));
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
