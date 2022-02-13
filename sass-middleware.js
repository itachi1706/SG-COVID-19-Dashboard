const path = require('path');
const fs = require('fs');
const sass = require('sass');
const csso = require('csso');

const cache = {}

module.exports = async function(req, res, next) {
  // ignore non-CSS requests
  if (!req.path.endsWith('.css')) return next();

  // derive SASS filepath from CSS request path
  const file = path.join(process.cwd(), 'public', 'stylesheets', req.path).replace(/css/g, 'sass'); // search in sass folder
  if (!fs.existsSync(file)) return res.status(404).end();

  // cache rendered CSS in memory
  let rp = req.path;
  if (!cache[rp]) {
    cache[rp] = sass.compile(file);

    // watch for changes in .sass
    fs.watchFile(file, _ => {
        delete cache[rp];
        fs.unwatchFile(file);
    });
  }

  res.header('content-type', 'text/css');
  res.send((process.env.NODE_ENV) ? csso.minify(cache[req.path].css.toString()).css.toString() : cache[req.path].css.toString()); // Minify if production
}