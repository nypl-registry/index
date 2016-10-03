// Wrapper for vanilla js lib: https://github.com/rayvoelker/js-loc-callnumbers/

var vm = require('vm')
var fs = require('fs')

function execfile (path, context) {
  context = context || {}
  var data = fs.readFileSync(path)
  vm.runInNewContext(data, context, path)
  return context
}

var locCallClass = execfile('./lib/js-loc-callnumbers/locCallClass.js')

module.exports = { LocParser: locCallClass.locCallClass }
