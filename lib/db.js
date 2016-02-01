//this module works with the datastore to do things~
var MongoClient = require('mongodb').MongoClient
var config = require("config")
var Db = require('mongodb').Db
var Server = require('mongodb').Server
var ObjectID = require('mongodb').ObjectID
var elasticsearch = require('elasticsearch')

var TripleStoreConnectURL = config['TripleStore']['mongoConnectURL']
var TripleStoreIp = config['TripleStore']['mongoIp']
var TripleStorePort = config['TripleStore']['mongoPort']
var TripleStoreDb = config['TripleStore']['mongoDb']

var exports = module.exports = {}

exports.collectionLookup = {}
exports.databaseTripleStore = null
exports.elasticsearchClient = null

exports.returnObjectId = function(id){
	return new ObjectID(id)
}


exports.returnElasticsearchClient = function(){

	if (!exports.elasticsearchClient){
		exports.elasticsearchClient = new elasticsearch.Client({
			host: config['Elasticsearch']
		})
		return exports.elasticsearchClient
	}else{
		return exports.elasticsearchClient
	}
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
			//console.log("[DB]:Connecting to Registry Triplestore")
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


exports.prepareAgentsIndex = function(cb){

	var client = exports.returnElasticsearchClient()


	var body = {
		agenttest:{
			properties:{
				dobString        : {"type" : "string", "index" : "not_analyzed"},
				dobYear        	 : {"type" : "integer", "index" : "not_analyzed"},
				dobDecade        : {"type" : "integer", "index" : "not_analyzed"},
				dodString        : {"type" : "string", "index" : "not_analyzed"},
				dodYear          : {"type" : "integer", "index" : "not_analyzed"},
				dodDecade        : {"type" : "integer", "index" : "not_analyzed"},
				viaf             : {"type" : "integer", "index" : "not_analyzed"},
				wikidata         : {"type" : "string", "index" : "not_analyzed"},
				lc               : {"type" : "string", "index" : "not_analyzed"},
				dbpedia          : {"type" : "string", "index" : "not_analyzed"},
				description      : {"type" : "string", "index" : "analyzed"},
				wikipedia        : {"type" : "string", "index" : "not_analyzed"},
				type             : {"type" : "string", "index" : "not_analyzed"},
				label            : {"type" : "string", "index" : "analyzed"},
				uri              : {"type" : "integer", "index" : "not_analyzed"},
				//topFiveTerms     : {"type" : "string", "index" : "analyzed"},
				//topFiveRoles     : {"type" : "string", "index" : "analyzed"},
				useCount         : {"type" : "string", "index" : "not_analyzed"}

			}
		}
	}




	client.indices.delete({
    	index: 'agentstest'

	}, function(err, res) {

		client.indices.create({
	    	index: 'agentstest'
	    	
		}, function(err, res) {

			if (err) console.log(err)

			client.indices.putMapping({index:"agentstest", type:"agenttest", body:body},function(err,res){
				if (err) console.log(err)
			})

			cb()

		})
	})

}

exports.indexAgents = function(agents, callback) {

	var client = exports.returnElasticsearchClient()

	var body = []



	agents.forEach(function(agent){
		body.push( { index:  { _index: 'agentstest', _type: 'agenttest', _id: agent.uri} }) 
		body.push(agent)
	})	
	client.bulk({
		body: body
	}, function (err, resp) {

		if (err) {
			callback(err)
		} else if (resp.errors){
			console.log("ERRRROR")
			console.log(JSON.stringify(resp,null,2) )
			callback(resp.errors)
		} else {

			callback()
		}
	})
}

