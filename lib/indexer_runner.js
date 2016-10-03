'use strict'

var utils = require('./utils.js')
var db = require('./db.js')
var ProcessViz = require('./process_viz.js').ProcessViz

/*
 *  Simple interface for managing a number of concurrent worker threads
 *
 *  Usage:
 *    var runner = new IndexerRunner(INDEX_NAME, COLLECTION_NAME, QUERY, CLUSTER_REF, OPTS)
 *
 *  INDEX_NAME : String, name of elastic index
 *  COLLECTION_NAME : String, name of mongodb collection
 *  QUERY : Hash, mongo query to run (i.g. {} indexes everything)
 *  CLUSTER_REF : Reference to `cluster` (i.e. `var cluster = require('cluster')`) created in worker script
 *  OPTS : Hash of options:
 *    botCount : Integer, number of concurrent threads to run, default 15
 *    useScreen : Bool, enables/disables fancy full-termainal graphics, default true
 */
class IndexerRunner {

  constructor (index, collection, query, cluster, options) {
    this.index = index
    this.collection = collection
    this.query = query
    this.cluster = cluster

    this.options = Object.assign({
      botCount: 15,
      useScreen: true
    }, options)

    this.activeBots = 0
    this.totalProcessed = 0

    this.workerEventHandlers = []
  }

  getQueryCount (cb) {
    // find out how many resources there are total
    db.returnCollectionTripleStore(this.collection, function (err, coll) {
      if (err) throw err

      coll.count(this.query, function (err, count) {
        if (err) throw err
        cb(count)
      })
    }.bind(this))
  }

  log () {
    if (this.viz) this.viz.log(arguments[0])
  }

  run () {
    this.init()

    this.viz.log('Running on query: ' + utils.hashToQueryString(this.query))

    this.getQueryCount(function (count) {
      this.jobCount = count
      this.viz.setOverall('total', this.jobCount)

      // break up how much to work for each bot
      var perBot = Math.ceil(this.jobCount / this.options.botCount)
      var start = 0

      this.viz.log('Running with ' + this.options.botCount + ' bot(s), ' + perBot + ' records/bot')

      this.buildWorker(0, perBot)
      var interval = setInterval(function () {
        if (this.activeBots === this.options.botCount) {
          clearInterval(interval)
          return false
        }

        start += perBot
        var limit = Math.min(perBot, this.jobCount - start)
        this.buildWorker(start, limit)
      }.bind(this), 30 * 1000)
    }.bind(this))
  }

  addWorkerEventHandler (name, handler) {
    if (!this.workerEventHandlers[name]) this.workerEventHandlers[name] = []
    this.workerEventHandlers[name].push(handler)
  }

  buildWorker (start, limit) {
    this.activeBots++

    var worker = this.cluster.fork()

    worker.on('message', function (msg) {
      if (msg.start) {
        this.viz.log('Worker ' + worker.id + ' start on ' + limit + ' item chunk starting at ' + start)
        this.viz.workerSet(worker.id, {completed: 0, total: limit, skipped: 0, status: 'seeking'})

        worker.send({ start: start, total: limit, query: this.query })
      }

      if (msg.totalUpdate) {
        this.viz.workerSet(worker.id, {status: 'building'})
        this.viz.workerIncrement(worker.id, 'completed', msg.totalUpdate)

        this.totalProcessed += parseInt(msg.totalUpdate)
        this.viz.setOverall('processed', this.totalProcessed)

        if (!this.options.useScreen && this.totalProcessed >= this.jobCount) {
          process.exit()
        }
      }

      if (msg.skipped) {
        this.viz.workerIncrement(worker.id, 'skipped', 1)
        this.totalProcessed += 1
      }

      Object.keys(this.workerEventHandlers).forEach((k) => {
        if (msg[k]) {
          this.workerEventHandlers[k].forEach((handler) => handler(msg))
        }
      })
    }.bind(this))
  }

  init () {
    this.viz = {
      log: console.log,
      workerSet: function () {},
      workerIncrement: function () {},
      setOverall: function () {}
    }

    if (this.options.useScreen) {
      this.viz = new ProcessViz()
    }

    this.cluster.on('disconnect', (worker, code, signal) => {
      var remaining = Object.keys(this.cluster.workers).length - 1
      this.viz.log(`${worker.id} finished. There are ${remaining} remaining bots`)

      this.viz.workerSet(worker.id, {status: 'done'})
      // if (remaining === 0 && totalProcessed >= jobCount) {
        // buildNext()
      // }
    })
  }
}

module.exports = IndexerRunner
