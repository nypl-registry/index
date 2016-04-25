var config = require('config')
var md5 = require('md5')
var request = require('request')
var fs = require('fs')
var async = require('async')
var R = require('ramda')
require('locus')

const INDEX_PARENT_CHILD = false
const PACK_DELIM = '||'

var exports = module.exports = {}

// Common utils:

exports.flatenTriples = function (object) {
  var flat = { objectLiteral: {}, objectUri: {}, objectUriWithLable: {} }

  for (var key in object) {
    // is this a triple
    if (config['predicatesAgents'].indexOf(key) > -1 || config['predicatesResources'].indexOf(key) > -1 || ['pcdm:memberOf'].indexOf(key) >= 0) {
      object[key].forEach((value) => {
        if (value.objectLiteral) {
          if (!flat.objectLiteral[key]) flat.objectLiteral[key] = []
          flat.objectLiteral[key].push(value.objectLiteral)
        }
        if (value.objectUri) {
          if (!flat.objectUri[key]) flat.objectUri[key] = []
          flat.objectUri[key].push(value.objectUri)

          if (value.label) {
            if (!flat.objectUri[key + ':label']) flat.objectUri[key + ':label'] = []

            flat.objectUri[key + ':label'].push({ uri: value.objectUri, label: value.label })
          }
        }
      })
    }
  }
  return flat
}

exports.extractTerms = function (object, exludeAgent) {
  // make sure it is in URI format
  if (!exludeAgent) {
    exludeAgent = false
  } else {
    if (!isNaN(exludeAgent)) exludeAgent = 'agents:' + exludeAgent
  }

  var flat = exports.flatenTriples(object)
  var terms = []

  if (flat.objectUri['dcterms:subject:label']) {
    flat.objectUri['dcterms:subject:label'].forEach((subject) => {
      if (subject.uri.substr(0, 6) === 'terms:') {
        terms.push(subject.label)
      } else {
        if (exludeAgent) {
          if (exludeAgent !== subject.uri) terms.push(subject.label)
        } else {
          terms.push(subject.label)
        }
      }
    })
  }
  return terms
}

exports.extractRoles = function (object, agentId) {
  // make sure it is in URI format
  if (!agentId) {
    agentId = false
  } else {
    if (!isNaN(agentId)) agentId = 'agents:' + agentId
  }

  var flat = exports.flatenTriples(object)
  var roles = []

  for (var key in flat.objectUri) {
    if (key.substr(0, 6) === 'roles:' && key.substr(key.length - 6, 6) !== ':label') {
      flat.objectUri[key].forEach((agent) => {
        if (agent === agentId) {
          // translate them
          if (config['thesaurus']['relatorMap'][key]) {
            roles.push(config['thesaurus']['relatorMap'][key])
          }
        }
      })
    }
  }

  return roles
}

// Get list of contributor labels from db record
exports.extractContributors = function (object) {
  var flat = exports.flatenTriples(object)
  var contributors = []

  for (var key in flat.objectUri) {
    if (key.match(/^(roles:\w+:label|dcterms:contributor:label)$/)) {
      flat.objectUri[key].forEach((agent) => {
        if (contributors.indexOf(agent['label']) < 0) contributors.push(agent['label'])
      })
    }
  }

  return contributors
}

exports.parseYear = function (value) {
  var ret = {string: value.toString()}

  if ((typeof value === 'string') && value.split('-').length > 2) {
    value = value.replace('-00', '-01')

    var parsed = Date.parse(value)
    if (!isNaN(parsed)) {
      parsed = new Date(parsed)
      ret.year = parsed.getFullYear()
    }
  } else {
    if (value && !isNaN(parseInt(value))) {
      ret.year = parseInt(value)
    }
  }

  if (ret.year) {
    ret.decade = ret.year - (ret.year % 10)
  }

  return ret
}

// Resources fields extraction:

exports.extractResourceIndexFields = function (resource, cb) {
  var rec = exports.extractIndexFields(resource)
  if (true) {
    rec.termLabels = exports.extractTerms(resource)
    rec.contributorLabels = exports.extractContributors(resource)
  }

  /*
  // TODO Is this a better field name maybe?
  resource.topFiveTerms = utils.extractTerms(resource)
  resource.topFiveRoles = utils.extractRoles(resource)
  */

  // Build parent ids array:
  // TODO This is currently too slow, better handled externally; consider removing
  var parentUri = rec['parentUri']
  if (false && parentUri) {
    parentUrisTitles(parentUri, (parents) => {
      rec['parentUris'] = parents.map(function (p) { return p.uri })
      rec['parentUris_packed'] = parents.map(function (p) { return [p.uri, p.title].join('||') })

      var rootParent = parents[parents.length - 1]
      rec['rootParentUri'] = rootParent.uri
      rec['rootParentUri_packed'] = [rootParent.uri, rootParent.title].join('||')

      console.log('finished building parents array: ', parents)
      cb(rec)
    })
  } else {
    cb(rec)
  }
  // /return rec
}

// Build array of parent uris, with immediate parent first, root parent last
function parentUrisTitles (parentUri, cb, _parents) {
  var db = require('../lib/db.js')
  db.returnCollectionTripleStore('resources', function (err, resourcesCollection) {
    if (err) throw err

    var parents = _parents ? _parents : []
    resourcesCollection.findOne({uri: parentUri}).then((res) => {
      var title = res['dcterms:title'] && res['dcterms:title'][0] ? res['dcterms:title'][0]['objectLiteral'] : ''
      parents.push({ uri: parentUri, title: title })
      // console.log('parents now: ', parents)

      var grandparentUri = null
      if (res['pcdm:memberOf'] && res['pcdm:memberOf'].length > 0 && res['pcdm:memberOf'][0]['objectUri'] && res['pcdm:memberOf'][0]['objectUri'].match(/^res:\d+$/)) {
        grandparentUri = parseInt(res['pcdm:memberOf'][0]['objectUri'].split(':')[1])
      }
      if (grandparentUri) {
        // console.log('  looking up ', res['pcdm:memberOf'])
        parentUrisTitles(grandparentUri, cb, parents)
      } else {
        cb(parents)
      }
    })
  })
}

// Common field extraction:

exports.extractIndexFields = function (agentObject) {
  var flat = exports.flatenTriples(agentObject)

  // var stripPrefix = (urn) => urn.replace(/^\w+:/, '')
  //

  var results = {}

  var addResultValue = function (name, value) {
    if (results[name]) {
      if (typeof results[name] !== 'object') {
        results[name] = [results[name]]
      }
      results[name].push(value)
    } else {
      results[name] = value
    }
  }

  var addResultYear = function (name, values) {
    R.flatten([values]).forEach(function (value) {
      var parsed = exports.parseYear(value)
      addResultValue(name + 'String', parsed.string)
      if (parsed.year) {
        addResultValue(name + 'Year', parsed.year)
      }
      if (parsed.decade) {
        addResultValue(name + 'Decade', parsed.decade)
      }
    })
  }

  if (flat.objectLiteral['dbo:birthDate']) {
    flat.objectLiteral['dbo:birthDate'].forEach((date) => {
      results['dobString'] = date.toString()
      if (date.split('-').length > 2) {
        date = date.replace('-00', '-01')
        var parsed = Date.parse(date)
        if (!isNaN(parsed)) {
          parsed = new Date(parsed)
          results['dobYear'] = parsed.getFullYear()
        }
      } else {
        if (!isNaN(parseInt(date))) results['dobYear'] = parseInt(date)
      }
      if (results['dobYear']) {
        results['dobDecade'] = results['dobYear'] - (results['dobYear'] % 10)
      }
    })
  }
  if (flat.objectLiteral['dbo:deathDate']) {
    // often there is dob and dod the same
    flat.objectLiteral['dbo:deathDate'].forEach((date) => {
      if (date.toString() !== results['dobString']) {
        results['dodString'] = date.toString()
        if (date.split('-').length > 2) {
          date = date.replace('-00', '-01')
          var parsed = Date.parse(date)
          if (!isNaN(parsed)) {
            parsed = new Date(parsed)
            results['dodYear'] = parsed.getFullYear()
          }
        } else {
          if (!isNaN(parseInt(date))) results['dodYear'] = parseInt(date)
        }
        if (results['dodYear']) {
          results['dodDecade'] = results['dodYear'] - (results['dodYear'] % 10)
        }
      }
    })
  }

  if (flat.objectLiteral['dcterms:description']) {
    flat.objectLiteral['dcterms:description'].forEach((desc) => {
      results['description'] = desc
    })
  }

  if (flat.objectUri['skos:exactMatch']) {
    flat.objectUri['skos:exactMatch'].forEach((exactMatch) => {
      if (exactMatch.split('viaf:').length > 1) results['viaf'] = parseInt(exactMatch.split('viaf:')[1])
      if (exactMatch.split('wikidata:').length > 1) results['wikidata'] = exactMatch.split('wikidata:')[1]
      if (exactMatch.split('lc:').length > 1) results['lc'] = exactMatch.split('lc:')[1]
      if (exactMatch.split('dbr:').length > 1) results['dbpedia'] = exactMatch.split('dbr:')[1]
    })
  }

  if (flat.objectLiteral['foaf:depiction'] && results['wikidata']) {
    flat.objectLiteral['foaf:depiction'].forEach((depiction) => {
      var filename = depiction.substr(depiction.length - 4, 4).toLowerCase()
      if (filename === 'jpeg') filename = '.jpg'
      if (filename === 'tiff') filename = '.tif'
      if (filename === '.svg') filename = '.png'
      if (filename === '.tif') filename = '.jpg'
      if (filename.search(/\./) === -1) filename = '.' + filename
      filename = results['wikidata'] + filename
      results['depiction'] = filename
    })
  }

  if (flat.objectLiteral['nypl:filename']) {
    var imageId = flat.objectLiteral['nypl:filename'][0]
    results['depiction'] = `http://images.nypl.org/index.php?id=${imageId}&t=w`
  }

  if (flat.objectLiteral['foaf:isPrimaryTopicOf']) {
    flat.objectLiteral['foaf:isPrimaryTopicOf'].forEach((wikipedia) => {
      results['wikipedia'] = wikipedia
    })
  }

  if (flat.objectUri['rdf:type']) {
    flat.objectUri['rdf:type'].forEach((type) => {
      if (type.split('foaf:').length > 1) results['type'] = type.split('foaf:')[1]
    })
  }

  if (flat.objectLiteral['skos:prefLabel']) {
    flat.objectLiteral['skos:prefLabel'].forEach((label) => {
      results['label'] = label
    })
  }

  if (results['viaf']) {
    if (results['viaf'] > 2000000000) {
      delete results['viaf']
    }
  }

  // Resources string literals:
  //   dcterms:title
  //   skos:note
  ['dcterms:title', 'skos:note'].forEach((key) => {
    if (flat.objectLiteral[key]) {
      results[key.replace(/^\w+:/, '')] = flat.objectLiteral[key].filter((n) => (typeof n === 'string'))
    }
  })

  if (flat.objectUri['dcterms:language']) {
    results['language'] = flat.objectUri['dcterms:language']
  }

  if (flat.objectUri['dcterms:alternative']) {
    results['alternative'] = flat.objectUri['dcterms:alternative']
  }

  if (flat.objectUri['dcterms:subject']) {
    results['subject'] = flat.objectUri['dcterms:subject']
  }
  if (flat.objectUri['dcterms:subject:label']) {
    results['subject_packed'] = flat.objectUri['dcterms:subject:label'].map((pair) => [pair.uri, pair.label].join(PACK_DELIM))
  }

  if (flat.objectUri['dcterms:type']) {
    results['materialType'] = flat.objectUri['dcterms:type']
  }

  if (flat.objectUri['rdf:type']) {
    // results['type'] = flat.objectUri['rdf:type'][0].replace(/\w+:/, '').toLowerCase()
    results['type'] = flat.objectUri['rdf:type']
    if (INDEX_PARENT_CHILD) results['_type'] = flat.objectUri['rdf:type'][0].replace(/\w+:/, '').toLowerCase()
  }

  if (flat.objectUri['pcdm:memberOf'] && flat.objectUri['pcdm:memberOf'][0] && flat.objectUri['pcdm:memberOf'][0].match(/^res:\d+/) && flat.objectUri['dcterms:identifier']) {
    var parentId = parseInt(flat.objectUri['pcdm:memberOf'][0].split(':')[1])
    if (INDEX_PARENT_CHILD) results['_parent'] = parentId
    else results['parentUri'] = parentId

    // If this is an item, it must either be a collectionitem or a componentitem
    if (results['_type'] === 'item') {
      // Compare parentId with superparent id to determine if (item) is direct descendent of collection or component
      var superparentIds = flat.objectUri['dcterms:identifier'].filter((i) => i.match(/^urn:superparent:/)).map((i) => i.split(':').pop())
      var parentType = superparentIds.length >= 0 && superparentIds[0] === parentId ? 'collection' : 'component'
      // override _type accordingly:
      results['_type'] = `${parentType}item`
      // console.log('set parent type: ' + results['_type'])
    }
  }

  if (flat.objectUri['dcterms:contributor']) {
    results['contributor'] = flat.objectUri['dcterms:contributor']
  }
  if (flat.objectUri['dcterms:contributor:label']) {
    results['contributor_packed'] = flat.objectUri['dcterms:contributor:label'].map((pair) => [pair.uri, pair.label].join(PACK_DELIM))
  }

  if (flat.objectUri['dcterms:identifier']) {
    results['identifier'] = flat.objectUri['dcterms:identifier']
  }

  if (flat.objectUri['classify:holdings']) {
    results['holdings'] = parseInt(flat.objectLiteral['classify:holdings'])
  }

  if (flat.objectLiteral['nypl:publicDomain']) {
    results['publicDomain'] = flat.objectLiteral['nypl:publicDomain'][0] === true
  }
  if (flat.objectLiteral['nypl:suppressed']) {
    results['suppressed'] = flat.objectLiteral['nypl:suppressed'][0] === true
  }

  if (flat.objectUri['nypl:owner']) {
    results['owner'] = flat.objectUri['nypl:owner']
  }

  if (flat.objectLiteral['db:dateStart']) {
    addResultYear('dateStart', flat.objectLiteral['db:dateStart'])
  }

  if (flat.objectLiteral['db:dateEnd']) {
    addResultYear('dateEnd', flat.objectLiteral['db:dateEnd'])
  }

  config['predicatesResources'].filter(function (pred) { return pred.match(/^roles:/) }).forEach(function (pred) {
    if (flat.objectUri[pred]) {
      // console.log("index roles: ", pred, flat.objectUri[pred])

      if (!results['contributor']) results['contributor'] = []

      var role = pred.replace(/^roles:/, '')

      // Func to add contrib to flattened array:
      var addContribs = (urns) => {
        results['contributor'] = R.uniq(results['contributor'].concat(urns))
      }

      // Add agents urn as-is and with contributor role prefix:
      var urns = flat.objectUri[pred]
      // urns = urns.map( stripPrefix )
      addContribs(urns)
      addContribs(urns.map((urn) => `${role}:${urn}`))

      results[`contributor_${role}_packed`] = flat.objectUri[`${pred}:label`].map((pair) => [pair.uri, pair.label].join(PACK_DELIM))
    }
  })

  results['uri'] = agentObject.uri

  if (agentObject.topFiveTerms) results.topFiveTerms = agentObject.topFiveTerms
  if (agentObject.topFiveRoles) results.topFiveRoles = agentObject.topFiveRoles
  if (agentObject.useCount) results.useCount = agentObject.useCount

  return results
}

// takes an ary of arys produced by .extractTerms or .extractRoles and reduces it to the top 5 subjects/roles used
exports.topFiveTerms = function (termsArrays) {
  if (!termsArrays) return []
  if (typeof termsArrays !== 'object') return []

  var terms = {}

  termsArrays.forEach((ary) => {
    ary.forEach((term) => {
      if (!terms[term]) terms[term] = 0
      terms[term]++
    })
  })

  for (var x in terms) {
    if (config['blackListTermsForAuthorsTopFive'].indexOf(x) > -1) {
      delete terms[x]
    }
  }

  var termsSorted = Object.keys(terms).sort(function (a, b) { return terms[b] - terms[a] })
  return termsSorted.splice(0, 5)
}

// builds the URL to find a wikimedia image
exports.returnWikimediaImageUrls = function (filename) {
  var results = {300: false, 200: false, 100: false}
  var imageMd5 = md5(filename)
  var addPng = ''
  var addLossy = ''
  var addJpg = ''

  if (filename.search(/\.svg/i) > -1) addPng = '.png'

  if (filename.search(/\.tif/i) > -1) {
    addLossy = 'lossy-page1-'
    addJpg = '.jpg'
  }

  results['300'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + imageMd5.charAt(0) + '/' + imageMd5.charAt(0) + imageMd5.charAt(1) + '/' + encodeURI(filename) + '/' + addLossy + '300px-' + encodeURI(filename) + addPng + addJpg
  results['200'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + imageMd5.charAt(0) + '/' + imageMd5.charAt(0) + imageMd5.charAt(1) + '/' + encodeURI(filename) + '/' + addLossy + '200px-' + encodeURI(filename) + addPng + addJpg
  results['100'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + imageMd5.charAt(0) + '/' + imageMd5.charAt(0) + imageMd5.charAt(1) + '/' + encodeURI(filename) + '/' + addLossy + '100px-' + encodeURI(filename) + addPng + addJpg

  return results
}

exports.downloadWikiImage = function (urlObj, filename, cb) {
  var downloaded = false

  async.eachSeries([ urlObj['300'], urlObj['200'], urlObj['100'] ], function (url, callback) {
    if (!downloaded) {
      request.get(url)
        .on('response', function (res) {
          if (res.statusCode === parseInt(200)) {
            // create file write stream
            var fws = fs.createWriteStream(filename)
            // setup piping
            res.pipe(fws)

            res.on('end', function () {
              downloaded = true
              process.nextTick(function () {
                callback()
              })
            })
          } else {
            callback()
          }
        })
    } else {
      callback()
    }
  }, function (err) {
    if (err) throw err
    cb(downloaded)
  })
}

exports.hashToQueryString = function (obj, prefix) {
  var str = []
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + '[' + p + ']' : p
      var v = obj[p]
      str.push(typeof v === 'object' ? exports.hashToQueryString(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v))
    }
  }
  return str.join('&')
}
