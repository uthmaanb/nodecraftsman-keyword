"use strict"

var env = require("./env")
var dbOptions = require("../../database.json")[env]
var DBWrapper = require("node-dbi").DBWrapper

var DBWrapper

if (dbOptions.driver === "sqlite3") {
  var dbWrapper = new DBWrapper("sqlite3", { path: dbOptions.filename })
} else {
  throw new Error("No suitable database config found")
}

dbWrapper.connect()
module.exports = dbWrapper
