'use strict'

const mysql = require('mysql');
const access = require('./access');

module.exports =
{
   name: 'rest-api',
   host: 'http://localhost',
   db: {
      get : mysql.createConnection({
         host: 'localhost',
         user: access.name,
         password: access.password,
         database: access.database
      })
   }
}
