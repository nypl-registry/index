'use strict'

var IndexerRunner = require('../lib/indexer_runner.js')

var cluster = require('cluster')
var collectionName = 'resources'

var VALID_TYPES = ['all', 'collection', 'component', 'item']

// Parsc cmd line opts:
var argv = require('optimist')
  .usage('Index resources index with various types\nUsage: $0 -type TYPE')
  // .demand('type')
  .describe('type', 'Specify type to index (' + VALID_TYPES.join(', ') + ')')
  .default('uri', null)
  .describe('uri', 'Specify single uri to inex')
  .boolean(['disablescreen', 'rebuild'])
  .describe('disablescreen', 'If set, output printed to stdout rather than taking over screen with fancy visuals')
  .describe('rebuild', 'If set, all data in index deleted and new schema applied')
  .argv

// TODO Need to resolve whether or not to index resources according to their domain type: collection, container, item, capture
// For now, not doing this. Seems to add more trouble than benefit atm
// This flag controls a couple local decision points,
// but making it `true` will not necessarily fully enable it
var INDEX_DISTINCT_RESOURCE_TYPES = false
if (INDEX_DISTINCT_RESOURCE_TYPES && VALID_TYPES.indexOf(argv.type) < 0) {
  console.log('Invalid type. Should be one of: ' + VALID_TYPES.join(', '))
  process.exit()
}

var db = require('../lib/db.js')
var utils = require('../lib/utils.js')

// Index single item by uri:
if (argv.uri) {
  db.returnCollectionTripleStore(collectionName, function (err, coll) {
    if (err) throw err
    console.log(collectionName + " By URI: '" + argv.uri + "'")
    coll.findOne({uri: parseInt(argv.uri)}).then(function (resource) {
      console.log('Extract index fields for resource:')
      console.dir(resource)
      utils.extractResourceIndexFields(resource, (indexRec) => {
        console.log('Index record: ')
        console.log('__________________________________')
        console.log(indexRec)

        db.indexResources([indexRec], function () {
          console.log('Done saving')
          process.exit()
        })
      })
    })
  })

// Master script:
} else if (cluster.isMaster) {
  var useScreen = !argv.disablescreen
  var rebuild = argv.rebuild

  var buildByQuery = function (query) {
    var runner = new IndexerRunner('resources', 'resources', query, cluster, {
      botCount: 15,
      useScreen: useScreen
    })
    runner.run()
  }

  var tasks = []
  if (INDEX_DISTINCT_RESOURCE_TYPES) {
    if (['all', 'collection'].indexOf(argv.type) >= 0) tasks.push(function () { buildByQuery({'rdf:type.objectUri': 'nypl:Collection'}) })
    if (['all', 'component'].indexOf(argv.type) >= 0) tasks.push(function () { buildByQuery({'rdf:type.objectUri': 'nypl:Component'}) })
    if (['all', 'item'].indexOf(argv.type) >= 0) {
      tasks.push(function () {
        buildByQuery({
          'rdf:type.objectUri': 'nypl:Item',
          // 'pcdm:memberOf.objectUri': {'$exist': 1},
          'pcdm:memberOf.objectUri': {'$ne': 'res:undefined'}
        })
      })
    }
  } else {
    // tasks.push(function () { buildByQuery({}) })
    tasks.push(function () { buildByQuery({"dcterms:identifier.objectUri": {"$regex": '^urn:bnum:'}}) })
  }

  var buildNext = function () {
    if (tasks.length > 0) tasks.shift()()
  }

  if (rebuild) db.prepareResourcesIndex(buildNext)
  else buildNext()

// Worker script:
} else {
  var _ = require('highland')

  var buildIndexRecord = _.wrapCallback(function (resource, cb) {
    utils.extractResourceIndexFields(resource, (rec) => cb(null, rec))
  })

  db.returnCollectionTripleStore(collectionName, function (err, resourcesCollection) {
    if (err) throw err

    // ask for where to start
    process.send({ start: true })

    process.on('message', function (msg) {
      if (typeof msg.start === 'number') {
        _(resourcesCollection.find(msg.query).skip(parseInt(msg.start)).limit(msg.total).batchSize(msg.total).stream())
          .map(buildIndexRecord)
          .sequence()
          .filter(function (rec) {
            var valid = true
            if (INDEX_DISTINCT_RESOURCE_TYPES) {
              // Ensure it's either a) a collection, or b) a comp/item/cap with a parent id:
              valid = rec['_type'] === 'collection'
              valid |= (['component', 'componentitem', 'collectionitem', 'capture'].indexOf(rec['_type']) >= 0) && !isNaN(rec['_parent'])
              valid |= (['item'].indexOf(rec['_type']) >= 0) && isNaN(rec['_parent'])
              if (!valid) process.send({ skipped: rec['uri'] })
            }
            return valid
          })
          .batch(500)
          .map((x) => {
            process.send({ totalUpdate: x.length })
            return x
          })
          .map(_.curry(db.indexResources))
          .nfcall([])
          .series()

          .done(function (err) {
            if (err) console.log(err)
            process.exit()
          })
      }
    })
  })
}
