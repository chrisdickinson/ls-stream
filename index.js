var through = require('through') 
  , path = require('path')
  , base_fs = require('./fs-base')

module.exports = ls

function join(bits) {
  return path.join.apply(path, bits)
}

function ls(fs, dir) {
  if(arguments.length === 1) {
    dir = fs
    fs = base_fs
  }

  var stream = through()
    , pending = 1
    , wd = [dir]

  process.nextTick(start)

  return stream

  function start() {
    if(!stream.paused) {
      fs.readdir(wd[0], receive(wd.slice()))
    } else {
      stream.once('drain', start)
    }
  }

  function receive(paths) {
    return function got_entries(err, entries) {
      var pending_stat = entries.length
        , stats = []

      for(var i = 0, len = entries.length; i < len; ++i) {
        enter(entries[i], i)
      }

      if(!entries.length) {
        done()
      }
      return

      function enter(entry, idx) {
        var new_paths = paths.slice()
        new_paths.push(entry)
        fs.stat(join(new_paths), function(err, stat) {
          stats[idx] = stat
          !--pending_stat && done()
        })
      }

      function done() {
        var new_paths
        for(var i = 0, len = entries.length; i < len; ++i) {
          new_paths = paths.concat([entries[i]])
          stream.queue({path: join(new_paths), stat: stats[i]})
          if(stats[i].isDirectory()) {
            ++pending
            fs.readdir(join(new_paths), receive(new_paths))
          }
        }

        !--pending && stream.queue(null)
      }
    }
  }
}
