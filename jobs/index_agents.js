var cluster = require('cluster');

if (cluster.isMaster) {

	var db = require("../lib/db.js")
	var config = require("config")
	var blessed = require('blessed')
	var contrib = require('blessed-contrib')
	//var screen = blessed.screen()
	
	var botCount = 11


	db.returnCollectionTripleStore("agents",function(err,agentsCollection){
		agentsCollection.count(function(err,count){


			var perBot = Math.floor(count / botCount)
			//console.log(perBot)

			var start = -1


			var buildWorker = function(){

				start = start + perBot

				var worker = cluster.fork();
				console.log('Spawing worker:',worker.id, "starting at: ",start)

				//send the first one
				//worker.send({ work: getWork(worker.id) })
				//activeBotCount++

			}

			for (var i = 1; i <= botCount -1 ; i++) {
				setTimeout(function(){
					buildWorker()
				}, Math.floor(Math.random() * (10000 - 0)))
			}







		})
	})




} else {



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