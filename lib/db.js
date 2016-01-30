//this module works with the datastore to do things~
var MongoClient = require('mongodb').MongoClient
var config = require("config")
var Db = require('mongodb').Db
var Server = require('mongodb').Server
var ObjectID = require('mongodb').ObjectID

var TripleStoreConnectURL = config['TripleStore']['mongoConnectURL']
var TripleStoreIp = config['TripleStore']['mongoIp']
var TripleStorePort = config['TripleStore']['mongoPort']
var TripleStoreDb = config['TripleStore']['mongoDb']

var exports = module.exports = {}

exports.collectionLookup = {}
exports.databaseTripleStore = null

exports.returnObjectId = function(id){
	return new ObjectID(id)
}

exports.databaseConnectTripleStore = function(cb){
	if (exports.databaseTripleStore){
		if (cb) cb()
		return true
	}	
	MongoClient.connect(TripleStoreConnectURL, function(err, dbTripleStore) {	
		if (err){
			console.log("Error connecting to registry:",err)
		}else{
			console.log("[DB]:Connecting to Registry Triplestore")
			exports.databaseTripleStore = dbTripleStore
		}
		if (cb) cb()
	})
}

exports.databaseClose = function(cb){
	if (exports.databaseTripleStore) exports.databaseTripleStore.close()
	if (cb) cb()
}

exports.returnCollectionTripleStore = function(collectionName,cb){
	exports.databaseConnectTripleStore(function(){

		if (exports.collectionLookup[collectionName]){
			cb(null,exports.collectionLookup[collectionName])
		}else{
			var collection = exports.databaseTripleStore.collection(collectionName)
			exports.collectionLookup[collectionName] = collection
			cb(null,exports.collectionLookup[collectionName])
		}
		
		
	})
}

