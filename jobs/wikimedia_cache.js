
var db = require("../lib/db.js")
var utils = require("../lib/utils.js")

var config = require("config")
var blessed = require('blessed')
var contrib = require('blessed-contrib')
var _ = require('highland')
var s3 = require('s3')
var fs = require( 'fs' )

var screen = blessed.screen()
//hideBorder: true,
var grid = new contrib.grid({rows: 12, cols: 12,  screen: screen})

//grid.set(row, col, rowSpan, colSpan, obj, opts)
var logWidget = grid.set(0, 0, 12, 4, contrib.log, { fg: "green", selectedFg: "green", label: 'Log' })
var donutWidge = grid.set(0, 4, 12, 8, contrib.donut, {
	label: 'Wikimedia Image Download',
	radius: 56,
	arcWidth: 24,
	spacing: 3,
	yPadding: 1,
	
})








screen.key(['C-c'], function(ch, key) {
 return process.exit(0);
});






var total = 100000, totalDone = 0

//get all the filenames we have
var client = s3.createClient({
	maxAsyncS3: 20,     // this is the default
	s3RetryCount: 3,    // this is the default
	s3RetryDelay: 1000, // this is the default
	multipartUploadThreshold: 20971520, // this is the default (20 MB)
	multipartUploadSize: 15728640, // this is the default (15 MB)
	s3Options: {
		accessKeyId: process.env.AWSKEY,
		secretAccessKey: process.env.AWSSECRET,
		region: "us-east-1"
	}
})

var params = {
  s3Params: {
    Bucket: "data.nypl.org",
    Delimiter: "/wikimedia_cache"
  },
}

var allFiles = {}

var lister = client.listObjects(params)
lister.on('error', function(err) {
  //console.error("unable to list:", err.stack)
  logWidget.log("unable to list:")
  logWidget.log(err.stack)
})

lister.on('data', function(data) {
	if (data.Contents){
		data.Contents.forEach(f =>{
			var filename = f.Key.replace('wikimedia_cache/','')
			if (filename!='') allFiles[filename] = true
		})
	} 
	//console.log("Downloaded", allFiles.length,"file names...")
	logWidget.log("Downloaded " + Object.keys(allFiles).length + " file names...")
})

lister.on('end', function() {


	var downloadUpload = function(agent,callback){

		if (agent.wikidataImage && agent.wikidata){

			var urls = utils.returnWikimediaImageUrls(agent.wikidataImage)

			var filename = agent.wikidataImage.substr(agent.wikidataImage.length-4,4).toLowerCase()
			if (filename=='jpeg') filename = '.jpg'
			if (filename=='tiff') filename = '.tif'	
			if (filename=='.svg') filename = '.png'
			if (filename=='.tif') filename = '.jpg'
			if (filename.search(/\./)==-1) filename = "."+filename
			filename = agent.wikidata + filename


			donutWidge.setData([{percent: (totalDone/total), label: totalDone +"/"+total, color: 'green'}])

			screen.render()



			if (allFiles[filename]){
				totalDone++
				callback()
				return true
			}

			utils.downloadWikiImage(urls,filename,function(downloaded){
				if (downloaded){
					//upload it to s3
					var params = {
						localFile: "./"+filename,
						s3Params: {
							Bucket: "data.nypl.org",
							Key: "wikimedia_cache/"+filename
						}
					}
					totalDone++
					var uploader = client.uploadFile(params)
					uploader.on('error', function(err) {
						//console.error("unable to upload:", err.stack);
						logWidget.log("unable to upload:")
						logWidget.log(err.stack)
						logWidget.log(filename)

						fs.unlinkSync("./"+filename)
						callback()
					})
					uploader.on('end', function() {
						fs.unlinkSync("./"+filename)
						logWidget.log(filename)
						callback()						
					})
				}else{
					//console.log("Could not download",agent.wikidataImage , agent.wikidata)
					logWidget.log("Could not download" + agent.wikidataImage  + agent.wikidata)
					callback()
				}				
			})		
		}else{
			callback()
		}
	}
	db.returnCollectionTripleStore("externalDataCacheAgents",function(err,agentDataCache){

		agentDataCache.count({ wikidataImage : { $ne: null}},{wikidata:1,wikidataImage:1},function(err,c){total=c})

		_(agentDataCache.find({ wikidataImage : { $ne: null}},{wikidata:1,wikidataImage:1}).batchSize(10).stream())
			.map(_.curry(downloadUpload))
			.nfcall([])
			.series()
			.done(function(){
				
				logWidget.log("Done")
			})
	})

})









