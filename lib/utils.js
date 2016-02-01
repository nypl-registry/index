
var config = require("config")
var md5 = require("md5")
var request = require( 'request' )
var fs = require( 'fs' )
var async = require( 'async' )

var exports = module.exports = {}

exports.collectionLookup = {}
exports.databaseTripleStore = null

exports.flatenTriples = function(object){
	
	var flat = { objectLiteral: {}, objectUri: {}}
	
	for (var key in object){
		//is this a triple
		if (config['predicatesAgents'].indexOf(key)>-1 || config['predicatesResources'].indexOf(key)>-1 ){

			object[key].forEach(value => {
				if (value.objectLiteral){
					if (!flat.objectLiteral[key]) flat.objectLiteral[key] = []
					flat.objectLiteral[key].push(value.objectLiteral)
				}
				if (value.objectUri){
					if (!flat.objectUri[key]) flat.objectUri[key] = []
					flat.objectUri[key].push(value.objectUri)

					if (value.label){
						if (!flat.objectUri[key+':label']) flat.objectUri[key+':label'] = []

						flat.objectUri[key+':label'].push({ uri:value.objectUri, label: value.label})
					}
				}
			})
		}
	}
	return flat
}

exports.extractTerms = function(object,exludeAgent){

	//make sure it is in URI format
	if (!exludeAgent){
		exludeAgent = false
	}else{
		if (!isNaN(exludeAgent)) exludeAgent = "agents:"+exludeAgent
	}

	
	
	var flat = exports.flatenTriples(object)
	var terms = []

	if (flat.objectUri['dcterms:subject:label']){
		flat.objectUri['dcterms:subject:label'].forEach(subject => {
			if (subject.uri.substr(0,6)==='terms:'){
				terms.push(subject.label)
			}else{
				if (exludeAgent){
					if (exludeAgent != subject.uri) terms.push(subject.label)
				}else{
					terms.push(subject.label)
				}
			}
		})
	}	
	return terms
}

//takes an ary of arys produced by .extractTerms and reduces it to the top 5 subjects used
exports.topFiveTerms = function(termsArrays){

	if (!termsArrays) return []
	if (typeof termsArrays != "object") return []
	
	var terms = {}

	termsArrays.forEach(ary => {
		ary.forEach(term =>{
			if (!terms[term]) terms[term] = 0
			terms[term]++
		})
	})

	for (var x in terms){
		if (config['blackListTermsForAuthorsTopFive'].indexOf(x)>-1){
			delete terms[x]
		}
	}

	termsSorted = Object.keys(terms).sort(function(a,b){return terms[b]-terms[a]})	
	return termsSorted.splice(0,5)
}


//builds the URL to find a wikimedia image
exports.returnWikimediaImageUrls = function(filename){

	var results = {300: false, 200: false, 100: false}
	var imageMd5 = md5(filename)
	var addPng = "", addLossy = "", addJpg = ""

	if (filename.search(/\.svg/i)>-1) addPng = ".png"

	if (filename.search(/\.tif/i)>-1) { 
		addLossy = "lossy-page1-"
		addJpg = ".jpg"
	}
	
	results['300'] = "https://upload.wikimedia.org/wikipedia/commons/thumb/" + imageMd5.charAt(0) + '/' + imageMd5.charAt(0) + imageMd5.charAt(1) + '/' + encodeURI(filename) + '/' + addLossy + '300px-' + encodeURI(filename) + addPng + addJpg
	results['200'] = "https://upload.wikimedia.org/wikipedia/commons/thumb/" + imageMd5.charAt(0) + '/' + imageMd5.charAt(0) + imageMd5.charAt(1) + '/' + encodeURI(filename) + '/' + addLossy + '200px-' + encodeURI(filename) + addPng + addJpg
	results['100'] = "https://upload.wikimedia.org/wikipedia/commons/thumb/" + imageMd5.charAt(0) + '/' + imageMd5.charAt(0) + imageMd5.charAt(1) + '/' + encodeURI(filename) + '/' + addLossy + '100px-' + encodeURI(filename) + addPng + addJpg


	return results


}

exports.downloadWikiImage = function(urlObj,filename,cb){

	var downloaded = false

	async.eachSeries([ urlObj['300'], urlObj['200'], urlObj['100']] , function(url, callback) {

		if (!downloaded){
			var req = request.get( url )
				.on( 'response', function( res ){

					if (res.statusCode==parseInt(200)){

						// create file write stream
						var fws = fs.createWriteStream( filename )
						// setup piping
						res.pipe( fws )

						res.on( 'end', function(){					  
						  downloaded = true
						  process.nextTick(function(){
						  	callback()
						  })						  
						})
					}else{
						callback()
					}
				})

		}else{
			callback()
		}


	}, function(err){


		cb(downloaded)


	});




}



