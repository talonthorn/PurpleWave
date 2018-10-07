'use strict'

const http = require('http');
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const access = require('./access');
const config = require('./config');

const connection = config.db.get;

connection.connect(function(err) {
   if (err) throw err
   console.log("Connected to mySql.")
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

var server = app.listen(7777, function() {
   var port = server.address().port;

   console.log("Listening at %s", port);
});

app.get('/', function (req, res) {
   return res.status(201).send({ message: 'hello' })
});

//retreive all records
app.get("/cats", function(req, res) {
   connection.query("select * from Cats", function (error, results, fields) {
      if (error) throw error;
      res.status(201).end(JSON.stringify(results));
   });
});

//retreive single record
app.get("/cats/:id", function(req, res) {
   connection.query("select * from Cats where Cindex=?", [req.params.id], function (error, results, fields) {
      if (error) throw error;
      res.status(201).end(JSON.stringify(results));
   });
});

