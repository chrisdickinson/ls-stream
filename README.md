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

#### 'data' entry object

```javascript
{ path: "path/to/file-or-dir"
, stat: fs.Stat object }
```

## license

MIT
