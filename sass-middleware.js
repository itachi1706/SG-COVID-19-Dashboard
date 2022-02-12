const path = require('path');
const fs = require('fs');
const sass = require('sass');

const cache = {}

module.exports = async function(req, res, next) {
  // ignore non-CSS requests
  if (!req.path.endsWith('.css')) return next();

  // derive SCSS filepath from CSS request path
  const file = path.join(process.cwd(), 'public', 'stylesheets', req.path).replace(/css/g, 'sass'); // search in sass folder
  if (!fs.existsSync(file)) return res.status(404).end();

  // cache rendered CSS in memory
  let rp = req.path;
  if (!cache[rp]) {
    cache[rp] = sass.renderSync({
      file,
      includePaths: [path.join(process.cwd(), 'node_modules')],
      outputStyle: (process.env.NODE_ENV === 'production') ? 'compressed' : 'expanded'
    });

    // watch for changes in .scss
    fs.watchFile(file, _ => {
        delete cache[rp];
        fs.unwatchFile(file);
    });
  }

  res.header('content-type', 'text/css');
  res.send(cache[req.path].css.toString());
}