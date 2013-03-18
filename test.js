var ls = require('./index')
  , fs = require('fs')
  , path = require('path')
  , test = require('tape')

test('does not emit if paused', function(assert) {
  var stream = ls(path.join(__dirname, 'test-dir'))
    , paused = true

  stream.pause()

  stream.on('data', function() {
    if(paused) {
      assert.fail('should not emit events')
    }
  })

  stream.on('end', function() {
    assert.end()
  })

  setTimeout(function() {
    paused = false
    stream.resume()
  }, 10)
})

test('gets expected data', function(assert) {
  var expect_dirs
    , stream = ls(path.join(__dirname, 'test-dir'))

  expect_dirs = [ 
    'subdir'
  ] 

  stream
    .on('data', ondata)
    .on('end', onend)

  function ondata(entry) {
    var idx
    if((idx = expect_dirs.indexOf(path.basename(entry.path))) > -1) {
      assert.ok(entry.stat.isDirectory(), 'is dir')
      expect_dirs.splice(idx, 1)
    } else {
      assert.ok(entry.stat.isFile())
    }
  }

  function onend() {
    assert.equal(expect_dirs.length, 0)
    assert.end()
  }
})
