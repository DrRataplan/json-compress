# json-minify

Losslessly JSON objects. This works by renaming any strings in the input to shorter keys, combining
it with a mapping. This minification applies even when gzipping the whole thing. In a benchmark this
showed a substantial (~75%) improvement for uncompressed objects and a (>50%) improvement when
compressing afterwards with gzip:

```sh
➜  assets git:(master) ✗ ls -1shS
total 2,8M
2,2M schema.json
520K schema-minified.json
 60K schema.json.gz
 28K schema-minified.json.gz
```

## When should you use this?

Use this library to minify and unminify JSON objects that are going to be sent over the network. Use
this especially when you:

* Are stuck with JSON: using a binary format will be better hands-down but makes it harder to
  inspect data
* Have JSON objects with repeating keys and strings, like the schema format we use with Fonto
  (conveniently added as an example). Don't use this when your keys and values are not
  repeating. There's no use, it will just make the JSON hard to read...
* You want to reduce the network overhead for your JSON endpoints with minimal impact on your
existing APIs / served mimetypes

## How do I use this?

See the tests! If you want to minify JSON served by your server just import `doMinify` from this
package, call it with the raw data (as an JSON object) and serve the return.

On the client side, imoprt `doUnminify` from this package, call it with the minified data and work
with the return value of this function!

## Should I still use GZIP?

Yep. This is a last-crumbs optimization! GZIP over JSON strings compresses them well, but this adds the last bit!

## You're removing repetitions, GZIP should remove repetitions as well, what's up here?

My thoughts exactly, but empirical evidence shows the results. Check them yourself of you want!

```sh
➜ cd /tmp
➜ git clone git+ssh://www.github.com:DrRataplan/json-minify
➜ cd json-minify
➜ npm i
➜ npm test
➜ cd assets
➜ gzip *.json -k
➜ ls -1shS
total 2,8M
2,2M schema.json
520K schema-minified.json
 60K schema.json.gz
 28K schema-minified.json.gz
```

Seeing different results, or did I make a mistake? Reach out!

## Is this free?

As in free beer.

