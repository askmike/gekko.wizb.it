const content = require('./content');
const _ = require('lodash');
const md = require('./md');
const pug = require('pug');
const fs = require('fs');
const del = require('delete');
const ncp = require('ncp');
const package = require('../gekko/package');

const CONFIG = {
  order: {
    introduction: [
      'about_gekko',
      'supported_exchanges',
      'scope'
    ],
    installation: [
      'installing_gekko',
      'installing_gekko_on_windows',
      'Installing gekko_using_docker',
      'configuring_gekko_on_a_server',
      'updating_gekko'
    ],
    features: [
      'backtesting',
      'importing'
    ],
    strategies: [
      'introduction',
      'creating_a_strategy',
      'gekko_indicators',
      'talib_indicators'
    ],
    commandline: [
      'about_the_commandline',
      'plugins',
      'Importing',
      'backtesting',
      'tradebot'
    ],
    'gekko-broker': [
      'introduction',
      'sticky_order',
      'wrapper_api'
    ],
    extending: [
      'add_an_exchange',
      'add_a_plugin',
      'other_software'
    ],
    internals: [
      'architecture',
      'events',
      'server_api',
      'gekko_ui',
      'budfox',
    ]
  }
}

const locals = {
  root: '',
  version: package.version
}

const getIndex = subtree => name => {
  const index = CONFIG.order[subtree].indexOf(name);

  if(index === -1)
    return 100;

  return index;
}

const nav = _.map(_.keys(CONFIG.order), d => {

  // skip subtrees not specified above
  if(!content.tree[d])
    return;

  const get = getIndex(d);

  const subnab = content.tree[d].sort((a, b) => get(a) - get(b))

  return {
    name: d,
    content: content.tree[d]
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