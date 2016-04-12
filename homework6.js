// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"use strict";
var express = require("express"),
    http = require("http"),
    redis = require("redis"),
    bodyParser = require("body-parser"),
    redisClient = redis.createClient(),
    app = express();

//check if sever is connected
redisClient.on("connect", function() {
    console.log("connected");
});
http.createServer(app).listen(3000);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//get and set the stat of flip coin
app.get("/stats", function(req, res) {
    redisClient.hgetall("stats", function(err, result) {
        if (redisClient.exists("stats")) {
            
        } else {
            redisClient.hmset("stats", "wins", 0, "losses", 0);
        }
        res.json(result);
    });
});
//POST /flip
app.post("/flip", function(req, res) {
    var choice = req.body;
    console.log("user choice: " + choice.call);
    var compare = (Math.floor(Math.random() * 2) === 0) ? "heads" : "tails"; //choose random
    console.log("system choice: " + compare);
    if (choice.call === compare) {
        redisClient.hincrby("stats", "wins", 1, function(err, result) {
            console.log("wins:" + result);
        });
        res.json({
            "result": "win"
        });
    } else {
        redisClient.hincrby("stats", "losses", 1, function(err, result) {
            console.log("losses:" + result);
        });
        res.json({
            "result": "lose"
        });
    }
});

//DELETE ON /stats
app.delete("/stats", function(req, res) {
    redisClient.hmset("stats", "wins", 0, "losses", 0, function(err, result) {
        console.log("stats has been reset to 0 ");
        res.json(result);
    });
});
