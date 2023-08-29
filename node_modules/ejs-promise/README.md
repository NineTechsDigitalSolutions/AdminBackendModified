# EJS Promise

Embedded JavaScript templates with Generator Support.

## Installation

```bash
$ npm install ejs-promise
```

## Defferent with `mde` and `tj` 's implement of [ejs](https://www.npmjs.com/package/ejs)

The compiled render function no longer return the rendered result directly.
It instead return a `Promise` object.
Which has a property `outputStream` on it.
The promise object got resolved after all rendering is done, 
or it got rejected if there is some error during run the templete.
Beside this, the outputStream on it is a `ReadableStream`, 
which will output the rendered result immediatly without wait for the render
done.

## Features
  * Use `Generator` and `Promise` In the template.
  * Streamed render without wait until a whole templete is rendered
  * Control flow with `<% %>`
  * Escaped output with `<%= %>` (escape function configurable)
  * Unescaped raw output with `<%- %>`
  * Newline-trim mode ('newline slurping') with `-%>` ending tag
  * Whitespace-trim mode (slurp all whitespace) for control flow with `<%_ _%>`
  * Custom delimiters (e.g., use '<? ?>' instead of '<% %>')
  * Includes
  * Client-side support
  * Static caching of intermediate JavaScript
  * Static caching of templates
  * Complies with the [Express](http://expressjs.com) view system

## Example

```html
<% if (user) { %>
  <h2><%= user.name %></h2>
<% } %>
```

## Usage

```javascript
var template = ejs.compile(str, options);
template(data)
.then(function (result) {
  // => Rendered HTML string
});

ejs.render(str, data, options)
.then(function (result) {
  // => Rendered HTML string
});

ejs.renderFile(filename, data, options, function(err, resultPromise){
  resultPromise
  .then(function (result) {
    // => Rendered HTML string
  });
});
```

It is also possible to use `ejs.render(dataAndOptions);` where you pass
everything in a single object. In that case, you'll end up with local variables
for all the passed options. However, be aware that your code could break if we 
add an option with the same name as one of your data object's properties.
Therefore, we do not recommend using this shortcut.

## Options

  - `cache`           Compiled functions are cached, requires `filename`
  - `filename`        The name of the file being rendered. Not required if you 
    are using `renderFile()`. Used by `cache` to key caches, and for includes.
  - `context`         Function execution context
  - `compileDebug`    When `false` no debug instrumentation is compiled
  - `client`          When `true`, compiles a function that can be rendered 
    in the browser without needing to load the EJS Runtime 
    ([ejs.min.js](https://github.com/mde/ejs/releases/latest)).
  - `delimiter`       Character to use with angle brackets for open/close
  - `debug`           Output generated function body
  - `strict`          When set to `true`, generated function is in strict mode
  - `_with`           Whether or not to use `with() {}` constructs. If `false` then the locals will be stored in the `locals` object. Set to `false` in strict mode.
  - `localsName`      Name to use for the object storing local variables when not using `with` Defaults to `locals`
  - `rmWhitespace`    Remove all safe-to-remove whitespace, including leading
    and trailing whitespace. It also enables a safer version of `-%>` line
    slurping for all scriptlet tags (it does not strip new lines of tags in
    the middle of a line).
  - `escape`          The escaping function used with `<%=` construct. It is
    used in rendering and is `.toString()`ed in the generation of client functions. (By default escapes XML).
  - `streamOptions`   Options that will be passed to underlining PassThrough stream.

## Returned promise properties (extend normal promise)
  
  - `outputStream`      (stream.passThrough) stream that will pipe result out withoud render finished
  - `noBuffer`          (method) stop buffering data, make this promise resolve empty buffer.
  - `useBuffer`         (method) renable buffer.
  - `waitFlush`         (method) prevent this promise from rendering more data than the stream pipe target required.
  - `defered.interrupt` (method) method interupt the rendering process


This project uses [JSDoc](http://usejsdoc.org/). For the full public API 
documentation, clone the repository and run `npm run doc`. This will run JSDoc 
with the proper options and output the documentation to `out/`. If you want 
the both the public & private API docs, run `npm run devdoc` instead.

## Tags

  - `<%`              'Scriptlet' tag, for control-flow, no output
  - `<%_`             'Whitespace Slurping' Scriptlet tag, strips all whitespace before it
  - `<%=`             Outputs the value into the template (escaped)
  - `<%-`             Outputs the unescaped value into the template
  - `<%#`             Comment tag, no execution, no output
  - `<%%`             Outputs a literal '<%'
  - `%%>`             Outputs a literal '%>'
  - `%>`              Plain ending tag
  - `-%>`             Trim-mode ('newline slurp') tag, trims following newline
  - `_%>`             'Whitespace Slurping' ending tag, removes all whitespace after it

For the full syntax documentation, please see [docs/syntax.md](https://github.com/mde/ejs/blob/master/docs/syntax.md).

## Includes

Includes either have to be an absolute path, or, if not, are assumed as
relative to the template with the `include` call. For example if you are 
including `./views/user/show.ejs` from `./views/users.ejs` you would 
use `<%- include('user/show') %>`.

You must specify the `filename` option for the template with the `include` 
call unless you are using `renderFile()`.

You'll likely want to use the raw output tag (`<%-`) with your include to avoid
double-escaping the HTML output.

```html
<ul>
  <% for (var i = 0; i < users.length; i++) { var user = users[i]; %>
    <%- include('user/show', {user: user}) %>
  <% } %>
</ul>
```

Includes are inserted at runtime, so you can use variables for the path in the
`include` call (for example `<%- include(somePath) %>`). Variables in your
top-level data object are available to all your includes, but local variables
need to be passed down.

NOTE: Include preprocessor directives (`<% include user/show %>`) are
still supported.

## Custom delimiters

Custom delimiters can be applied on a per-template basis, or globally:

```javascript
var ejs = require('ejs'),
    users = ['geddy', 'neil', 'alex'];

// Just one template
ejs.render('<?= users.join(" | "); ?>', {users: users}, {delimiter: '?'})
.then(function (result) {
  // => 'geddy | neil | alex'
});

// Or globally
ejs.delimiter = '$';
ejs.render('<$= users.join(" | "); $>', {users: users})
.then(function (result) {
// => 'geddy | neil | alex'
});
```

## Caching

EJS ships with a basic in-process cache for caching the intermediate JavaScript
functions used to render templates. It's easy to plug in LRU caching using
Node's `lru-cache` library:

```javascript
var ejs = require('ejs')
  , LRU = require('lru-cache');
ejs.cache = LRU(100); // LRU cache with 100-item limit
```

If you want to clear the EJS cache, call `ejs.clearCache`. If you're using the
LRU cache and need a different limit, simple reset `ejs.cache` to a new instance
of the LRU.

## Layouts

EJS does not specifically support blocks, but layouts can be implemented by
including headers and footers, like so:


```html
<%- include('header') -%>
<h1>
  Title
</h1>
<p>
  My page
</p>
<%- include('footer') -%>
```

## Promise

You could use promise in templete for async control or other purpose

```javascript
var ejs = require('ejs');

// Just one template
ejs.render('<?= wait() ?>', 
    {
        wait: function (x) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve('wait a second!');
                }, 1000)
            })
        }
    }, {delimiter: '?'})
.then(function (result) {
  // => 'wait a second!'
});
```

## Stream

You could stream output immediatly without wait for render to be finished.

Note: the `end` event will not be fired if there is a error and `error` handler for stream existed.

```javascript
var ejs = require('ejs');

// Just one template
ejs.render('first\n<?= wait() ?>\nsecond', 
    {
        wait: function (x) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve('wait a second!');
                }, 1000)
            })
        }
    }, {delimiter: '?'})
.outputStream.pipe(process.stdout);
// output 'first' then delay a second and output 'wait a second!', 'second'
```

## Client-side support

Go to the [Latest Release](https://github.com/mmis1000/ejs-promise/releases/latest), download
`./ejs.js` or `./ejs.min.js`. Alternately, you can compile it yourself by cloning 
the repository and running `jake build` (or `$(npm bin)/jake build` if jake is 
not installed globally).

Include one of these files on your page, and `ejs` should be available globally.

or you cou

### Example

```html
<div id="output"></div>
<script src="ejs.min.js"></script>
<script>
  var people = ['geddy', 'neil', 'alex'],
      promise = ejs.render('<%= people.join(", "); %>', {people: people});
  promise.then(function (html) {
    // With jQuery:
    $('#output').html(html);
    // Vanilla JS:
    document.getElementById('output').innerHTML = html;
  })
</script>
```

### Caveats

Most of EJS will work as expected; however, there are a few things to note:

1. Obviously, since you do not have access to the filesystem, `ejs.renderFile()` won't work.
2. For the same reason, `include`s do not work unless you use an `IncludeCallback`. Here is an example:
  ```javascript
  var str = "Hello <%= include('file', {person: 'John'}); %>",
      fn = ejs.compile(str, {client: true});
  
  fn(data, null, function(path, d){ // IncludeCallback
    // path -> 'file'
    // d -> {person: 'John'}
    // Put your code here 
    // Return the contents of file as a string
  }); // returns rendering promise
  ```
3. becuase browser won't has `Stream` (old browser may also lack of `Promise`), the `{client: true}` won't work unless `Stream` and `Promise` are exists
  ```html
    <!-- 
      1. you need a Stream implement to make {client: true} work 
         ex:
         https://github.com/substack/stream-browserify
      
      2. you need a Promise implement to make {client: true} work
         newer borwser may already has it, but the old won't
         ex:
         https://github.com/taylorhakes/promise-polyfill
    -->
    <script src="stream.min.js"></script>
    <script src="promise.min.js"></script>
    
    <script src="ejs.min.js"></script>
    
    <script>
      var str = "Hello",
          fn = ejs.compile(str, {client: true});
      
      fn(data).then(function (html) {
        // "Hello"
      })
    </script>
  ```

## Related projects

There are a number of implementations of EJS:

 * MDE's implementation: https://github.com/mde/ejs
 * TJ's implementation: https://github.com/tj/ejs
 * Jupiter Consulting's EJS: http://www.embeddedjs.com/
 * EJS Embedded JavaScript Framework on Google Code: https://code.google.com/p/embeddedjavascript/
 * Sam Stephenson's Ruby implementation: https://rubygems.org/gems/ejs
 * Erubis, an ERB implementation which also runs JavaScript: http://www.kuwata-lab.com/erubis/users-guide.04.html#lang-javascript

## License

Licensed under the Apache License, Version 2.0
(<http://www.apache.org/licenses/LICENSE-2.0>)

- - -
EJS Embedded JavaScript templates copyright 2112
mde@fleegix.org.

- - -
Modofied by
EJS Embedded JavaScript templates with stream copyright 2016
mmis1000@yahoo.com.tw
