// this module works with the datastore to do things~
var MongoClient = require('mongodb').MongoClient
var config = require('config')
// var Db = require('mongodb').Db
// var Server = require('mongodb').Server
var ObjectID = require('mongodb').ObjectID
var elasticsearch = require('elasticsearch')

var TripleStoreConnectURL = config['TripleStore']['mongoConnectURL']
// var TripleStoreIp = config['TripleStore']['mongoIp']
// var TripleStorePort = config['TripleStore']['mongoPort']
// var TripleStoreDb = config['TripleStore']['mongoDb']

var exports = module.exports = {}

exports.collectionLookup = {}
exports.databaseTripleStore = null
exports.elasticsearchClient = null

exports.returnObjectId = function (id) {
  return new ObjectID(id)
}

exports.returnElasticsearchClient = function () {
  if (!exports.elasticsearchClient) {
    exports.elasticsearchClient = new elasticsearch.Client({
      host: config['Elasticsearch']
    })
    return exports.elasticsearchClient
  } else {
    return exports.elasticsearchClient
  }
}

exports.databaseConnectTripleStore = function (cb) {
  if (exports.databaseTripleStore) {
    if (cb) cb()
    return true
  }
  MongoClient.connect(TripleStoreConnectURL, function (err, dbTripleStore) {
    if (err) {
      console.log('Error connecting to registry:', err)
    } else {
      // console.log("[DB]:Connecting to Registry Triplestore")
      exports.databaseTripleStore = dbTripleStore
    }
    if (cb) cb()
  })
}

exports.databaseClose = function (cb) {
  if (exports.databaseTripleStore) exports.databaseTripleStore.close()
  if (cb) cb()
}

exports.returnCollectionTripleStore = function (collectionName, cb) {
  exports.databaseConnectTripleStore(function () {
    if (exports.collectionLookup[collectionName]) {
      cb(null, exports.collectionLookup[collectionName])
    } else {
      var collection = exports.databaseTripleStore.collection(collectionName)
      exports.collectionLookup[collectionName] = collection
      cb(null, exports.collectionLookup[collectionName])
    }
  })
}

exports.prepareAgentsIndex = function (cb) {
  var client = exports.returnElasticsearchClient()

  var body = {
    agent: {
      properties: {
        dobString: {'type': 'string', 'index': 'not_analyzed'},
        dobYear: {'type': 'integer', 'index': 'not_analyzed'},
        dobDecade: {'type': 'integer', 'index': 'not_analyzed'},
        dodString: {'type': 'string', 'index': 'not_analyzed'},
        dodYear: {'type': 'integer', 'index': 'not_analyzed'},
        dodDecade: {'type': 'integer', 'index': 'not_analyzed'},
        viaf: {'type': 'integer', 'index': 'not_analyzed'},
        wikidata: {'type': 'string', 'index': 'not_analyzed'},
        lc: {'type': 'string', 'index': 'not_analyzed'},
        dbpedia: {'type': 'string', 'index': 'not_analyzed'},
        description: {'type': 'string', 'index': 'analyzed'},
        wikipedia: {'type': 'string', 'index': 'not_analyzed'},
        type: {'type': 'string', 'index': 'not_analyzed'},
        label: {'type': 'string', 'index': 'analyzed', 'fields': { 'folded': { 'type': 'string', 'analyzer': 'folding' } }},
        uri: {'type': 'integer', 'index': 'not_analyzed'},
        // topFiveTerms     : {"type" : "string", "index" : "analyzed"},
        // topFiveRoles     : {"type" : "string", "index" : "analyzed"},
        useCount: {'type': 'integer', 'index': 'not_analyzed'}
      }
    }
  }

  client.indices.delete({
    index: 'agents'

  }, function (err, res) {
    if (err) throw err
    client.indices.create({
      index: 'agents',
      body: {
        settings: {
          number_of_shards: 3,
          analysis: {
            filter: {
              yearStrip: {
                type: 'pattern_replace',
                pattern: '[0-9]',
                replacement: ''
              }
            },
            analyzer: {
              folding: {
                tokenizer: 'edgeNgrame',
                filter: [ 'lowercase', 'asciifolding', 'yearStrip' ]
              }
            },
            tokenizer: {
              edgeNgrame: {
                type: 'edgeNGram',
                min_gram: '3',
                max_gram: '5',
                token_chars: [ 'letter' ]
              }
            }

          }
        }
      }
    }, function (err, res) {
      if (err) {
        console.log(err)
        process.exit(0)
      }

      client.indices.putMapping({index: 'agents', type: 'agent', body: body}, function (err, res) {
        if (err) {
          console.log(err)
          process.exit(0)
        }
      })

      cb()
    })
  })
}

exports.prepareResourcesIndex = function (cb) {
  var client = exports.returnElasticsearchClient()

  var common_properties = {
    uri: {'type': 'integer', 'index': 'not_analyzed'},
    parentUris: {'type': 'integer', 'index': 'not_analyzed'},
    rootParentUri: {'type': 'integer', 'index': 'not_analyzed'},
    parentUri: {'type': 'integer', 'index': 'not_analyzed'},
    parentUris_packed: {'type': 'string', 'index': 'not_analyzed'},
    rootParentUri_packed: {'type': 'string', 'index': 'not_analyzed'},
    title: { 'type': 'string', 'index': 'analyzed', 'fields': { 'folded': { 'type': 'string', 'analyzer': 'folding' } } },
    depiction: { 'type': 'string', 'index': 'not_analyzed' },
    description: {'type': 'string', 'index': 'analyzed'},
    type: {'type': 'string', 'index': 'not_analyzed'},
    materialType: {'type': 'string', 'index': 'not_analyzed'},
    contributor: {'type': 'string', 'index': 'not_analyzed'},
    contributor_packed: {'type': 'string', 'index': 'not_analyzed'},
    holdings: {'type': 'integer', 'index': 'not_analyzed'},
    note: {'type': 'string', 'index': 'analyzed'},
    suppressed: {'type': 'boolean', 'index': 'not_analyzed'},
    publicDomain: {'type': 'boolean', 'index': 'not_analyzed'},
    owner: {'type': 'string', 'index': 'not_analyzed'},
    subject: {'type': 'string', 'index': 'not_analyzed'},
    subject_packed: {'type': 'string', 'index': 'not_analyzed'},
    language: {'type': 'string', 'index': 'not_analyzed'},
    identifier: {'type': 'string', 'index': 'not_analyzed'},
    created: {'type': 'date', 'index': 'not_analyzed'},
    createdYear: {'type': 'integer', 'index': 'not_analyzed'},
    createdDecade: {'type': 'integer', 'index': 'not_analyzed'},
    createdString: {'type': 'string', 'index': 'not_analyzed'},
    dateStartYear: {'type': 'integer', 'index': 'not_analyzed'},
    dateStartDecade: {'type': 'integer', 'index': 'not_analyzed'},
    dateStartString: {'type': 'string', 'index': 'not_analyzed'},
    dateEndYear: {'type': 'integer', 'index': 'not_analyzed'},
    dateEndDecade: {'type': 'integer', 'index': 'not_analyzed'},
    dateEndString: {'type': 'string', 'index': 'not_analyzed'}
  }

  var bodies = [
    {
      resource: {
        properties: common_properties
      }
    }
  ]
  /*
  var bodies = [
    // {
    	// capture: {
    		// _parent: {
    			// type: "item",
    			// fielddata: { loading: "eager_global_ordinals" }
    		// },
    		//properties: common_properties
    	// }
    // },
    {
      componentitem: {
        _parent: {
          type: 'component',
          fielddata: { loading: 'eager_global_ordinals' }
        },
        properties: common_properties
      }
    },
    {
      collectionitem: {
        _parent: {
          type: 'collection',
          fielddata: { loading: 'eager_global_ordinals' }
        },
        properties: common_properties
      }
    },
    {
      component: {
        _parent: {
          type: 'collection',
          fielddata: { loading: 'eager_global_ordinals' }
        },
        properties: common_properties
      }
    },
    {
      collection: {
        properties: common_properties
      }
    },
    {
      item: {
        properties: common_properties
      }
    },
    {
      resource: {
        properties: common_properties
      }
    }
  ]
  */

  client.indices.delete({ index: 'resources' }, function (err, res) {
    if (err) throw err
    client.indices.create({
      index: 'resources',
      body: {
        settings: {
          number_of_shards: 3,
          analysis: {
            filter: {
              yearStrip: {
                type: 'pattern_replace',
                pattern: '[0-9]',
                replacement: ''
              }
            },
            analyzer: {
              folding: {
                tokenizer: 'edgeNgrame',
                filter: [ 'lowercase', 'asciifolding', 'yearStrip' ]
              }
            },
            tokenizer: {
              edgeNgrame: {
                type: 'edgeNGram',
                min_gram: '3',
                max_gram: '5',
                token_chars: [ 'letter' ]
              }
            }
          }
        }
      } // body
    }, function (err, res) {
      if (err) console.log('ERROR(db.js): ', err)

      // Add mapping bodies in order of definition to ensure depth first bc parents must be defined last
      var addBody = function (body, cb) {
        var type = Object.keys(body)[0]
        client.indices.putMapping({ index: 'resources', type: type, body: body }, function (err, res) {
          if (err) console.log(err)
          else cb()
        })
      }
      var nextBody = function () {
        var body = null
        if ((body = bodies.shift())) {
          addBody(body, nextBody)
        }
      }
      nextBody()

      cb()
    })
  })
}

exports.indexAgents = function (agents, callback) {
  var client = exports.returnElasticsearchClient()

  var body = []

  agents.forEach(function (agent) {
    body.push({ index: { _index: 'agents', _type: 'agent', _id: agent.uri } })
    body.push(agent)
  })
  client.bulk({
    body: body
  }, function (err, resp) {
    if (err) {
      callback(err)
    } else if (resp.errors) {
      console.log('ERRRROR')
      console.log(JSON.stringify(resp, null, 2))
      callback(resp.errors)
    } else {
      callback()
    }
  })
}

// Generic interface for posting data in bulk mode into elastic search
var _indexGeneric = function (indexName, records, update, callback) {
  var client = exports.returnElasticsearchClient()
  var body = []

  records.forEach(function (record) {
    var index_statement = { _index: indexName, _id: record.uri }
    index_statement._type = record._type ? record._type : 'resource'
    // No longer need the _type (and it's going to throw an error bc it's redundant??):
    delete record._type
    if (record._parent) {
      // No longer need the parent
      index_statement.parent = record._parent
      delete record._parent
    }
    // TODO: configure whether or not to delete first:
    if (false) body.push({ delete: { _index: indexName, _type: 'componentitem', _id: record.uri, _parent: index_statement._parent } })

    if (update) {
      delete record.uri
      record = { doc: record }
    }

    // Is this an update or an index (replaces doc)
    var actionLine = update ? { update: index_statement } : { index: index_statement }
    body.push(actionLine)
    body.push(record)
  })

  client.bulk({ body: body }, function (err, resp) {
    if (err) {
      callback(err)
    } else if (resp.errors) {
      console.log('ERRRROR')
      console.log(JSON.stringify(resp, null, 2))
      callback(resp.errors)
    } else {
      callback()
    }
  })
}

// Submit given array of 'resource' doc updates to elastic search as INSERTS/OVERWRITES
exports.indexResources = function (records, callback) {
  _indexGeneric('resources', records, false, callback)
}

// Submit given array of 'resource' doc updates to elastic search as UPDATES
// Each doc must have an _id, a _type, and any other fields to update
exports.updateResources = function (records, callback) {
  _indexGeneric('resources', records, true, callback)
}
