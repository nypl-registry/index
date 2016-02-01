
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
exports.extractRoles = function(object,agentId){

	//make sure it is in URI format
	if (!agentId){
		agentId = false
	}else{
		if (!isNaN(agentId)) agentId = "agents:"+agentId
	}

	var flat = exports.flatenTriples(object)
	var roles = []

	for (var key in flat.objectUri){
		if (key.substr(0,6)==='roles:' && key.substr(key.length-6,6) != ':label'){	

			flat.objectUri[key].forEach(agent => {
				if (agent === agentId){
					//translate them
					if (config['thesaurus']['relatorMap'][key]){
						roles.push(config['thesaurus']['relatorMap'][key])
					}
				}
			})

	
		}
	}

	return roles
}

exports.extractIndexFields = function(agentObject){

	var flat = exports.flatenTriples(agentObject)

	var results = {}

	if (flat.objectLiteral['dbo:birthDate']){
		flat.objectLiteral['dbo:birthDate'].forEach(date =>{
			results['dobString'] = date.toString()
			if(date.split('-').length>2){
				date=date.replace('-00','-01')				
				var parsed = Date.parse(date)				
				if (!isNaN(parsed)){
					parsed = new Date(parsed)
					results['dobYear'] = parsed.getFullYear()
				}
			}else{
				if (!isNaN(parseInt(date))) results['dobYear'] = parseInt(date)
			}
			if (results['dobYear']){
				results['dobDecade'] = results['dobYear'] - (results['dobYear'] % 10)					
			}
		})
	}
	if (flat.objectLiteral['dbo:deathDate']){
		//often there is dob and dod the same
			flat.objectLiteral['dbo:deathDate'].forEach(date =>{

				if (date.toString != results['dobString']){
					results['dodString'] = date.toString()
					if(date.split('-').length>2){
						date=date.replace('-00','-01')				
						var parsed = Date.parse(date)				
						if (!isNaN(parsed)){
							parsed = new Date(parsed)
							results['dodYear'] = parsed.getFullYear()
						}
					}else{
						if (!isNaN(parseInt(date))) results['dodYear'] = parseInt(date)
					}
					if (results['dodYear']){
						results['dodDecade'] = results['dodYear'] - (results['dodYear'] % 10)					
					}
				}
			})
	}


	if (flat.objectLiteral['dcterms:description']){
		flat.objectLiteral['dcterms:description'].forEach(desc =>{
			results['description'] = desc
		})
	}


	if (flat.objectUri['skos:exactMatch']){
		flat.objectUri['skos:exactMatch'].forEach(exactMatch =>{			
			if (exactMatch.split('viaf:').length>1) results['viaf'] = parseInt(exactMatch.split('viaf:')[1])
			if (exactMatch.split('wikidata:').length>1) results['wikidata'] = exactMatch.split('wikidata:')[1]
			if (exactMatch.split('lc:').length>1) results['lc'] = exactMatch.split('lc:')[1]
			if (exactMatch.split('dbr:').length>1) results['dbpedia'] = exactMatch.split('dbr:')[1]
		})
	}

	if (flat.objectLiteral['foaf:depiction'] && results['wikidata']){
		flat.objectLiteral['foaf:depiction'].forEach(depiction =>{			
			var filename = depiction.substr(depiction.length-4,4).toLowerCase()
			if (filename=='jpeg') filename = '.jpg'
			if (filename=='tiff') filename = '.tif'	
			if (filename=='.svg') filename = '.png'
			if (filename=='.tif') filename = '.jpg'
			if (filename.search(/\./)==-1) filename = "."+filename
			filename = results['wikidata'] + filename
			results['depiction'] = filename
		})
	}

	if (flat.objectLiteral['foaf:isPrimaryTopicOf']){
		flat.objectLiteral['foaf:isPrimaryTopicOf'].forEach(wikipedia =>{
			results['wikipedia'] = wikipedia
		})
	}

	if (flat.objectUri['rdf:type']){
		flat.objectUri['rdf:type'].forEach(type =>{			
			if (type.split('foaf:').length>1) results['type'] = type.split('foaf:')[1]
		})
	}

	if (flat.objectLiteral['skos:prefLabel']){
		flat.objectLiteral['skos:prefLabel'].forEach(label =>{
			results['label'] = label
		})
	}


	if (results['viaf']){
		if (results['viaf'] > 2000000000){
			delete results['viaf']
		} 
	}


	results['uri'] = agentObject.uri



	return results
}




//takes an ary of arys produced by .extractTerms or .extractRoles and reduces it to the top 5 subjects/roles used
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






