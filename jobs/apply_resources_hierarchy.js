'use strict'

var IndexerRunner = require('../lib/indexer_runner.js')

var cluster = require('cluster')

var _ = require('highland')

var db = require('../lib/db.js')

var VALID_TYPES = ['all', 'collection', 'component', 'item']

// Parsc cmd line opts:
var argv = require('optimist')
  .usage('Index resources index with various types\nUsage: $0 -type TYPE')
  .describe('type', 'Specify type to index (' + VALID_TYPES.join(', ') + ')')
  .default('uri', null)
  .describe('uri', 'Specify single uri to inex')
  .boolean(['disablescreen', 'rebuild'])
  .describe('disablescreen', 'If set, output printed to stdout rather than taking over screen with fancy visuals')
  .describe('rebuild', 'If set, all data in index deleted and new schema applied')
  .argv

var events = require('events')
var eventEmitter = new events.EventEmitter()
var botCount = 5

/*
var jobTotal = null
var minUri = null
var maxUri = null
*/

var runner

if (cluster.isMaster) {
  var useScreen = !argv.disablescreen

  var buildByQuery = function (query) {
    runner = new IndexerRunner('resources', 'resources', query, cluster, {
      botCount: botCount,
      useScreen: useScreen
    })

    runner.addWorkerEventHandler('updateRecords', (msg) => {
      eventEmitter.emit('update-resource', msg.updateRecords)
    })

    runner.run()
  }

  var query = {}
  buildByQuery(query)

  runner.getQueryCount((count) => {
    var completed = 0
    // Listen for posted updates
    _('update-resource', eventEmitter)
      .flatten()
      .batchWithTimeOrCount(10000, 5000)
      .map((x) => {
        completed += x.length
        var percentage = Math.round(completed / count * 100)
        runner.log(`Processing ${x.length} of ${count}. ${percentage}% complete`)
        runner.log(` e.g. ${x.map((rec) => rec.uri).slice(0, 3).join(', ')}`)
        return x
      })
      .map(_.curry(db.updateResources))
      .nfcall([])
      .parallel(3)
      // .series()
      .done(function (err) {
        if (err) console.log(err)
        runner.log('All done')
        process.exit()
      })
  })
} else {
  var query = { constant_score: { filter: { missing: { field: 'parentUri' } } } }
  var countQuery = { }
  var initialParents = []

  if (false) { // debug Pageant of America collection
    initialParents = [{ title: '"The Pageant of America" Collection', uri: 101669044 }]
    query = { terms: { parentUri: [ initialParents[0].uri ] } }
    countQuery = { body: { query: { terms: { rootParentUri: [ initialParents[0].uri ] } } } }
  }

  process.send({ start: true })

  process.on('message', function (msg) {
    if (typeof msg.start === 'number') {
      // To overcome elastic inability to deep page...
      // Take the start & total computed for this worker by the indexrunner
      // and translate it into a uri range based on the min/max uris in the coll
      indexRangeToUriRange(msg.start, msg.total, (range) => {
        query.constant_score = {
          filter: {
            bool: {
              must: [
                {
                  range: {
                    uri: {
                      gte: range[0],
                      lt: range[1]
                    }
                  }
                },
                {
                  missing: {
                    field: 'parentUri'
                  }
                }
              ]
            }
          }
        }
        // console.log('processing: ', msg.start, msg.end)

        var client = db.returnElasticsearchClient()
        client.count({ index: 'resources', body: { query: query } }, (err, resp) => {
          if (err) throw err

          applyToAllResources(query, (resource) => {
            saveParentUris(resource, initialParents)
          }, (stats) => {
            // console.log('complete: ', stats.total)
          })
        })
      })
    }
  })

  // console.log('queuing listener')
  // Listen for posted updates
  _('local-update-resource', eventEmitter)
    .batchWithTimeOrCount(10000, 2000)
    .map((x) => {
      // console.log('sending ', x.length)
      process.send({ updateRecords: x })
    })
    .done(function (err) {
      if (err) console.log(err)
      process.exit()
    })
}

function saveParentUris (resource, parents, cb) {
  // console.log('save parents to ', resource.type, resource._id, resource._source.title, ':')

  var counts = {
    // numLeaves: 0,
    numChildren: 0,
    // totalChildren: 0 //,
    // numLeafChildren: 0,
    // numBranchChildren: 0
  }

  var onDone = (report) => {
    // console.log('all done processing ' + report.total + ' children. now update parent')

    process.send({ totalUpdate: report.total })

    counts.numChildren = report.total

    var update = Object.assign({
      _type: resource._type,
      uri: resource._id
    }, counts)
    // console.log('total: ', counts.totalChildren, 'for', resource._id)

    if (parents.length > 0) {
      var rootParent = parents[parents.length - 1]
      Object.assign(update, {
        // _parent: resource._parent,
        parentUris: parents.map(function (p) { return p.uri }),
        parentUris_packed: parents.map(function (p) { return [p.uri, p.title].join('||') }),
        rootParentUri: rootParent.uri,
        rootParentUri_packed: [rootParent.uri, rootParent.title].join('||')
      })
      // console.log(' > ', parents.length, update)
    }

    // console.log('save to resource ', resource._id, rootParent.uri, parents.length)
    // console.log('posting update: ', update)
    eventEmitter.emit('local-update-resource', update)
    // process.send({ updateRecord: update })

    if (report.total === 0) counts.isLeaf = true
    if (cb) cb(counts)
  }

  if (resource._source.type && resource._source.type.length > 0 && resource._source.type[0] === 'nypl:Capture') {
    onDone({total: 0})
  } else {
    applyToAllResources({ term: { parentUri: resource._id } }, (subResource) => {
      var newParents = [].concat([{ uri: parseInt(resource._id), title: resource._source.title }], parents)

      // counts.numChildren += 1

      saveParentUris(subResource, newParents, (childCounts) => {
        // console.log('adding leaves: ', counts.numLeaves, 'to', resource._id)
        // if (childCounts.isLeaf) counts.totalChildren += 1
        // counts.numLeaves += childCounts.numLeaves

        // console.log('adding children : ', childCounts.totalChildren, 'to', resource._id)
        // counts.totalChildren += 1 + childCounts.totalChildren
        // console.log('  added children : ', counts.totalChildren)

        // counts.numChildren += childCounts.numChildren
        // counts.numLeafChildren += childCounts.numLeafChildren
        // counts.numBranchChildren += childCounts.numBranchChildren
      })
    }, onDone)
  }
}

function indexRangeToUriRange (start, limit, cb) {
  var aggsQuery = {
    index: 'resources',
    size: 0,
    body: {
      aggs: {
        max_uri: {
          max: {
            field: 'uri'
          }
        },
        'min_uri': {
          'min': {
            'field': 'uri'
          }
        }
      }
    }
  }
  var client = db.returnElasticsearchClient()

  client.search(aggsQuery, (err, resp) => {
    if (err) throw err
    // console.log('resp: ', resp)
    var minUri = parseInt(resp.aggregations.min_uri.value)
    // var maxUri = parseInt(resp.aggregations.max_uri.value)

    var countQuery = { }
    client.count({ index: 'resources', query: countQuery }, (err, resp) => {
      if (err) throw err

      var total = parseInt(resp.count)
      var relativeRange = [start / total, (start + limit) / total]
      var startUri = Math.round(relativeRange[0] * total + minUri)
      var endUri = Math.round(relativeRange[1] * total + minUri)

      cb([startUri, endUri])
    })
  })
}

function applyToAllResources (query, cb, onComplete) {
  var client = db.returnElasticsearchClient()
  var processed = 0
  client.search({
    index: 'resources',
    // Set to 30 seconds because we are calling right back
    scroll: '30s',
    search_type: 'scan',
    body: {
      _source: ['uri', 'type', 'parentUri', 'title'],
      query: query
    }
  }, function getMoreUntilDone (error, response) {
    if (error) throw error
    // collect the title from each response
    response.hits.hits.forEach(function (resource) {
      processed += 1
      cb(resource)
    })

    if (processed < response.hits.total) {
      // now we can call scroll over and over
      client.scroll({
        scrollId: response._scroll_id,
        scroll: '30s'
      }, getMoreUntilDone)
    } else {
      // console.log(processed, response.hits.total, 'applying onComplete for resources identified by ', query)
      if (onComplete) onComplete({ total: response.hits.total })
    }
  })
}











  /*
  var viz = new ProcessViz()

  var buildWorker = function () {
    viz.log('var perBot = Math.ceil(', jobTotal, botCount)
    var perBot = Math.ceil(jobTotal / botCount)

    viz.log('start = ', minUri, activeBot, perBot)
    start = minUri + activeBot * perBot

    activeBot += 1

    var worker = cluster.fork()

    worker.on('message', function (msg) {
      if (msg.start) {
        worker.send({ start: start, end: start + perBot, query: query })

        viz.log('Worker ' + worker.id + ' process ' + start + ' - '  + (start + perBot))
        viz.workerData(worker.id, {completed: 0, total: perBot, skipped: 0, status: 'seeking'})
      }

      if (msg.totalUpdate) {
        totalProcessed += parseInt(msg.totalUpdate)
        viz.notifyProcessed(totalProcessed)

        // viz.log('Worker ' + worker.id + ' completed ' + msg.totalUpdate)
        viz.workerIncrement(worker.id, 'completed', msg.totalUpdate)
        viz.workerData(worker.id, {status: 'building'})

        if (!useScreen && totalProcessed >= jobTotal) {
          process.exit()
        }
      }

      if (msg.updateRecord) {
        // viz.log('Worker ' + worker.id + ' sent update: ', msg.updateRecord)
        eventEmitter.emit('update-resource', msg.updateRecord)
      }

      if (msg.updateRecords) {
        eventEmitter.emit('update-resource', msg.updateRecords)
      }

      if (msg.skipped) {
        totalProcessed += 1
        // message_log.log("Worker " + worker.id + " skipped record " + msg.skipped)
      }
    })
  }

  var aggsQuery = {
    index: 'resources',
    size: 0,
    body: {
      aggs: {
        "max_uri": {
          "max": {
            "field": "uri"
          }
        },
        "min_uri": {
          "min": {
            "field": "uri"
          }
        }
      }
    }
  }
  var client = db.returnElasticsearchClient()

  var countQuery = { }
  client.count({ index: 'resources', query: countQuery }, (err, resp) => {
    if (err) throw err

    jobTotal = parseInt(resp.count)
    viz.log('Total for ', query, jobTotal)

    viz.setJobCount(jobTotal)

    client.search( aggsQuery, (err, resp) => {
      // console.log('resp: ', resp)
      minUri = parseInt(resp.aggregations.min_uri.value)
      maxUri = parseInt(resp.aggregations.max_uri.value)
      viz.log('min max: ', minUri, maxUri)

      buildWorker()
      var interval = setInterval(function () {
        if (activeBot === botCount) {
          clearInterval(interval)
          return false
        }
        buildWorker()
      }, 20 * 1000)
    })
  })
  */
