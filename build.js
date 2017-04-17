const content = require('./content');
const _ = require('lodash');
const md = require('./md');
const pug = require('pug');
const fs = require('fs');
const del = require('delete');
const ncp = require('ncp');
const package = require('../gekko/package');

const CONFIG = {
  dirs: {
    order: [
      'introduction',
      'installation',
      'features',
      'strategies',
      'commandline',
      'extending',
      'internals'
    ]
  }
}

const locals = {
  root: '',
  version: package.version
}

const nav = _.map(CONFIG.dirs.order, f => {
  if(!content.tree[f])
    return;

  return {
    name: f,
    content: content.tree[f]
  }
}).filter(_.identity);

locals.nav = nav;

var template = pug.compile(fs.readFileSync('templates/layout.jade', 'utf8'));

del.sync('site');
fs.mkdirSync('site');
fs.mkdirSync('site/docs/')
_.each(content.folders, f => fs.mkdirSync(`site/docs/${f}`))

_.each(content.files, f => {
  // render html
  f.html = md(f.content);
  // set title
  f.title = _.first(f.content.split('\n')).substring(2);

  // prepare all jade vars
  let vars = {isDoc: true};
  _.merge(vars, locals, f);
  const page = template(vars);

  // page path
  const newPath = 'site/docs/' + f.filename.toLowerCase() + '.html';

  // write out
  fs.writeFileSync(newPath, page);

  console.log('wrote', newPath);
});

// render home page

// gekko supports as many exchanges, as there are `.js` files in the exchange directory
const walkSync = require('walk-sync');
const amountOfExchanges = walkSync('../gekko/exchanges/').filter(f => _.endsWith(f, '.js')).length;

// prepare all jade vars
let vars = {
  isDoc: false,
  amountOfExchanges: amountOfExchanges

};
_.merge(vars, locals);
const page = template(vars);
// write out
fs.writeFileSync('site/index.html', page);
console.log('wrote', 'site/index.html');


ncp('static', 'site/_static');
ncp('favicons', 'site/');