# ls-stream

a readable stream of file and directories paths and entries.

```javascript
var ls = require('ls-stream')

ls('.git')
    .on('data', console.log.bind(console))

```

## API

#### ls([fs,] directory) -> ls stream

create a readable stream of entry objects.

will start emitting data on next tick unless paused.

users may optionally provide their own `fs` object if native `fs` is not
available for whatever reason (e.g., in browser).

#### 'data' Entry object

```javascript
{ path: "path/to/file-or-dir"
, stat: fs.Stat object }
```

#### Entry.ignore([bool=true]) -> undefined

If called on the same event loop turn as the event is
received, prevents recursing into this directory (or is
a no-op if the entry represents a file). Optionally takes
a single argument which defaults to `true` to set the
"ignored" status.

```javascript
var through = require('through')
  , ls = require('ls-stream')

ls('/path')
  .pipe(through(function(entry) {
    console.log(entry.path)
    if(entry.path == "/path/something") {
      // if we see "/path/something" *don't* list files
      // and dirs that it contains.
      entry.ignore()
    }
  }))

```

**Warning:** As aforementioned, this only works if the entry
is ignored on the same event loop turn. For example, the following
code would *fail* to ignore the given entry:

```javascript
// WARNING: this will not work:
ls('/path')
  .pipe(through(function(entry) {
    // by the time we tell the entry that it
    // should be ignored, `ls` has already
    // recursed into it!
    setTimeout(function() {
      entry.ignore()
    }, 0)
  }))
```

## license

MIT
