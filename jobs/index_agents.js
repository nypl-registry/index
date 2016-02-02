var cluster = require('cluster');

if (cluster.isMaster) {

	var db = require("../lib/db.js")
	var utils = require("../lib/utils.js")
	var config = require("config")
	var blessed = require('blessed')
	var contrib = require('blessed-contrib')
	//var screen = blessed.screen()
	
	var botCount = 15, activeBot = 0
	var total = 0

	db.prepareAgentsIndex(function(){

		//find out how many agents there are total
		db.returnCollectionTripleStore("agents",function(err,agentsCollection){
			agentsCollection.count(function(err,count){

				//break up how much to work for each bot
				var perBot = Math.floor(count / botCount)

				//index 0
				var start = perBot*-1

				console.log("perBot",perBot)

				var buildWorker = function(){
					activeBot++
			
					start = start + perBot

					var worker = cluster.fork();

					worker.on('message', function(msg) {
						if (msg.start) {
							worker.send({ start: start , total : perBot -1 })
						}

						if (msg.totalUpdate){
							total = total + parseInt(msg.totalUpdate)
							console.log(total)
						}


					})
				}

				// for (var i = 1; i <= botCount; i++) {
				// 	setTimeout(function(){
				// 		buildWorker()
				// 	}, 10000)
				// }
				var interval = setInterval(function(){
					if (activeBot==botCount){
						clearInterval(interval)
						return false
					}
					buildWorker()

				},30000)


			})
		})
	})




} else {

	var db = require("../lib/db.js")
	var _ = require('highland')
	var utils = require("../lib/utils.js")
	var total = 0

	var skipRebuildResources = true

	var addResourceStats = _.wrapCallback(function addTopFiveSubject(agent,cb){


		if (skipRebuildResources && agent.topFiveTerms && agent.topFiveRoles && agent.useCount){
			//if enabled we will just use the existing data
			cb(null,agent)

		}else{

			//rebuild

			db.returnCollectionTripleStore("resources",function(err,resourcesCollection){

				var allTerms = []
				var allRoles = []
				var totalResources = 0

				_(resourcesCollection.find({allAgents: agent.uri}).stream())
					.map(r =>{
						allTerms.push(utils.extractTerms(r,agent.uri))
						allRoles.push(utils.extractRoles(r,agent.uri))
						totalResources++
					}).done(function(){

						allTerms = utils.topFiveTerms(allTerms)
						allRoles = utils.topFiveTerms(allRoles)
						agent.topFiveTerms = allTerms
						agent.topFiveRoles = allRoles
						agent.useCount = totalResources

						cb(err,agent)
					})
			})
		}
	})

	var updateAgentsCollection = _.wrapCallback(function updateAgentsCollection(agent,cb){
		db.returnCollectionTripleStore("agents",function(err,agentsCollection){
			agentsCollection.update({ uri:agent.uri }, {$set: { topFiveTerms: agent.topFiveTerms, topFiveRoles: agent.topFiveRoles, useCount: agent.useCount } },function(err,res){
				if (err) console.log(err)
				cb(err,agent)
			})
		})
	})

	db.returnCollectionTripleStore("agents",function(err,agentsCollection){
		//ask for where to start
		process.send({ start: true })

		process.on('message', function(msg){
			if (typeof msg.start === 'number'){
				console.log(cluster.worker.id, " Starting at",msg.start, "Limit ",msg.total )
				_(agentsCollection.find({}).skip(parseInt(msg.start)).limit(msg.total).batchSize(100).stream())
					.map(utils.extractIndexFields)
					.map(addResourceStats)
					.sequence()		
					.map(updateAgentsCollection)
					.sequence()					
					.batch(500)
					.map(x =>{
						total = total + x.length
						//console.log(total)
						process.send({ totalUpdate: x.length })
						return x
					})					
					.map(_.curry(db.indexAgents))
					.nfcall([])
					.series()

					.done(function(err){
						if (err) console.log(err)						
						console.log("Done")
					})
			}
		})
	})
}









// var donut = contrib.donut({
// 	label: 'INDEXING AGENTS',
// 	radius: 12,
// 	arcWidth: 6,
// 	spacing: 0.5,
// 	yPadding: 1,
// 	data: [
// 	  {percent: 80, label: 'web1', color: 'green'},
// 	  {percent: 80, label: 'web2', color: 'blue'},
// 	  {percent: 80, label: 'web2', color: 'blue'},
// 	  {percent: 80, label: 'web2', color: 'blue'},
// 	  {percent: 80, label: 'web3', color: 'red'}
// 	]
// });	

// screen.append(donut)
// screen.key(['C-c'], function(ch, key) {
//  return process.exit(0);
// });

// screen.render()