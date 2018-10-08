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
   console.log("Connected to mySql")
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
   return res.status(200).send({ message: 'hello' })
});

//create a new record
app.post("/cats", function(req, res) {
   var params = req.body;
   console.log('Insert record: ', params);

   if (!params.Breed) {
      return res.status(400).send({error:true, message:'Breed must have a value' });
   }
   connection.query('insert into Cats set ?', params, function(error, results, fields) {
      if (error) {
         if (error.code == 'ER_DUP_ENTRY') {
            var msg = 'Entry already exists for Breed \"' + params.Breed + '\"';
            console.log(msg);
            return res.status(400).send({error:true, message:msg});
         }

         throw error;
      }

      console.log('Record inserted');
      res.status(201).end(JSON.stringify(results));
   });
});

//retreive all records
app.get("/cats", function(req, res) {
   connection.query("select * from Cats", function (error, results, fields) {
      if (error) throw error;
      res.status(200).end(JSON.stringify(results));
   });
});

//retreive single record
app.get("/cats/:id", function(req, res) {
   var params = req.params;
   connection.query("select * from Cats where Cindex=?", [params.id], function (error, results, fields) {
      if (error) {
         throw error;
      }

      var status = 200;
      if (results.length == 0) {
         status = 204;
      }

      res.status(status).end(JSON.stringify(results));
   });
});

//update a record
app.put('/cats', function (req, res) {
   var params = req.body;
   console.log("Update record ", params.id, ": Origin=", params.origin);

   connection. query('update Cats set Origin=? where Cindex=?', [params.origin, params.id], function (error, results, fields) {
      if (error) throw error;

      if (results.affectedRows == 0) {
         var msg = 'Record id ' + params.id + ' was not found';
         console.log(msg);
         return res.status(400).send({error:true, message:msg});
      }

      console.log('Updated');
      res.status(201).end(JSON.stringify(results));
   });
});

//delete a record
app.delete('/cats/:id', function (req, res) {
   var params = req.params;
   console.log('Delete record: ', params.id);
   
   connection.query('delete from Cats where Cindex=?', [params.id], function (error, results, fields) {
      
      if (error) throw error;

      if (results.affectedRows > 0) {
         res.status(201).end('Record has been deleted');
         console.log('Record deleted');
      } else {
         res.status(400).end('Delete record was not found');
         console.log('Delete record was not found');
      }
   });
});

