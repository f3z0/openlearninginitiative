var express = require('express');
 var mongo = require('mongodb');

var app = express();
var server = new mongo.Server('localhost', 27017, {auto_reconnect: true});
db = new mongo.Db('test', server);

 app.get('/', function(req, res){
  
  var MongoClient = require('mongodb').MongoClient
      , format = require('util').format;
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
      if (err) {
          throw err;
      } else {
        db.collection('courses', function(err, collection) {
                collection.distinct('school', function(err, items) {
                  res.render('index.ejs', {items: items})
                    db.close();

                });
            });
      }
  });
 });

 app.get('/school/:school', function(req, res){
    
    var MongoClient = require('mongodb').MongoClient
        , format = require('util').format;
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
        if (err) {
            throw err;
        } else {
          db.collection('courses', function(err, collection) {
            collection.find({school:req.params.school}, {'short-desc':1}).toArray(function(err, items) {
              console.log(items)
                    res.render('school.ejs', {school: req.params.school, items: items})
                      db.close();

                  });
              });
        }
    });
 });

 app.get('/course/:id', function(req, res){
    
    var MongoClient = require('mongodb').MongoClient
        , format = require('util').format;
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
        if (err) {
            throw err;
        } else {
          db.collection('courses', function(err, collection) {
            console.log(req.params.id)
            collection.findOne( { _id: require('mongodb').ObjectID.createFromHexString(req.params.id) }, function(err, course) {
              console.log(err)
                    res.render('course.ejs', {course: course})
                      db.close();

                  });
              });
        }
    });
 });
 app.listen(8080);
 console.log('Listening on port 8080...');
