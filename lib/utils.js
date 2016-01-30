//this module works with the datastore to do things~


var exports = module.exports = {}

exports.collectionLookup = {}
exports.databaseTripleStore = null

exports.extractObjectLiterialValues = function(id){
	return new ObjectID(id)
}
