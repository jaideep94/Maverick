var express = require('express');
var app = express();
var jsTokens = require("js-tokens").default
var bodyParser = require("body-parser");
var NewsAPI = require('newsapi');
var newsapi = new NewsAPI('7ff8adecfd574c2092d7197bb6bd4606');
var control = "0";
var variable = "20";
var flag = 0;
var weatherInfo;
var weatherInfo2="32 °C, Haze at Delhi, India";
var unirest = require('unirest');
var serverName = 'localhost/';
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var express = require('express');
var app = express();
var date = new Date();
var bodyParser = require('body-parser');
var port = 8079;
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
//require('\public\js\index.js')();

//var server = http.createServer(handleRequest);
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/home', function(req, res) {
    res.sendFile(__dirname + "/public/views/welcome.html");
    // console.log(x.text);
});

app.listen(port, function() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", port);
});
app.post("/response", function(req, res) {
    var b = req.body.text;
    var a = b.toLowerCase();

    var token = a.match(jsTokens);
    console.log(token);
    console.log(token);
    for (var i = 0; i < token.length; i++) {
        if (token[i] == "date") {
            control = "1";
        }
        if (token[i] == "time") {
            control = "2";
        }
        if (token[i] == "weather") {
            control = "3";
            weatherShow();
        }
        if(token[i]=="google"){
          control="4";
        }
    }

    if (a == 'date and time') {

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var resp = hour + ":" + min + ":" + sec;



    }

    if (a != 'date' && a != 'time' && a != 'weather') {
        //console.log("hello");
        MongoClient.connect("mongodb://localhost:27017/query", function(err, db) {

            if (err) {
                return res.json(err);
            }


            db.collection('response').findOne({
                "name1": a
            }, {
                "name2": 1,
                "_id": 0
            }, function(err, doc) {
                if (err) {
                    res.sendStatus(500);
                }

                //console.log(doc);
                variable = doc;
                console.log(variable);
                db.close();
                if (!doc) {
                    var data = {};
                    data.name2 = "Poor Internet Connection";
                    variable = data;
                }
            });
        });
    }

    function weatherShow() {

        unirest.get("https://simple-weather.p.mashape.com/weather?lat=28.6139&lng=77.2090") //weather api
            .header("X-Mashape-Key", "Ri4j5gX4ORmshweHbjBSUUMevXWIp1i0xRujsnjCz7wW9w5zLB")
            .end(function(result) {

                var t = result.body;
                weatherInfo = t;

                var data = {};
                //  socket.emit('botEvent', t);
                data.name2 = t;

                variable = data;
            })
    }

    function dateShow() {
        var data = {};
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        var resp = year + ":" + month + ":" + day;

        data.name2 = day + " " + monthNames[month - 1] + " " + year;
        variable = data;

    }

    function timeShow() {

        var data = {};
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        data.name2 = hour + ":" + min + ":" + sec;
        variable = data;

    }

});

app.post("/response2", function(req, res) {
    setTimeout(function() {
        console.log("in send= " + variable.name2);
        console.log("Control=" + control);

        if (control != "0") {
          //  console.log("Control=" + control);
            if (control == "1") {
                variable.name2 = "1";
            }
            if (control == "2") {
                variable.name2 = "2";
            }
            if (control == "3") {
                variable.name2 = weatherInfo2;
                console.log(variable.name2);
            }
            if(control=="4"){
              variable.name2="Google Custom Search is on the top of page";
            }
            res.send(variable.name2);
        } else {
            res.send(variable.name2);
        }
        control = '0';

    }, 2000);


})

app.post("/response3", function(req, res) {

    var t = req.body;
    console.log(t);
    MongoClient.connect("mongodb://localhost:27017/login", function(err, db) {
        var collection = db.collection('values');
        collection.insert(t, function(err, res) {
            console.log("data has been stored in database");
            db.close();
        });
    });
});


newsapi.articles({
    source: 'the-hindu',
    sortBy: 'top'
}).then(articlesResponse => {
    console.log("News Downloaded");
    app.post("/newsresponse", function(req, res) {

        res.send(articlesResponse);



    })
});
