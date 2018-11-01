var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var url = 'mongodb://praneeth:praneeth123@ds159013.mlab.com:59013/student';

app.post('/register', function (req, res) {
    MongoClient.connect(url,{ useNewUrlParser: true }, function (err, client) {
        if (err) {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        var db = client.db();
        insertDocument(db, req.body, function () {
            res.write("Successfully inserted");
            res.end();
        });
    });
});
var insertDocument = function (db, data, callback) {
  console.log(data);
    db.collection('registrations').insertOne(data, function (err, result) {
        if (err) {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the student DB collection.");
        callback();
    });
};
app.put('/update',function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("student");
        console.log(req.body);
        dbo.collection("registrations").updateOne
        ({
            "userName": req.body.userName
        }, {$set: {"firstName": req.body.firstName}}, function (err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });
});
app.delete('/delete',function (req, res) {
    let userName = req.query.userName;
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("student");
        dbo.collection("registrations").deleteOne
        ({
            "userName": userName,
        }, function (err, result) {
            if (err) throw err;
            db.close();
            res.json(result);
        });
    });
})
app.get('/getData', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log("Param are QQQQQQQQQ" + searchKeywords);
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("student");
        var query = {userName: searchKeywords};
        console.log(query);
        dbo.collection("registrations").find(query).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;