const walkSync = require('walk-sync');
const _ = require('lodash');
const fs = require('fs');

const PATH = '../gekko/docs/';

// build structure
const fileNames = walkSync(PATH).filter(f => _.endsWith(f, '.md'));
const tree = {};

const filename = n => n.slice(0, -3)

const files = fileNames.map(f => {
  return {
    filename: filename(f),
    content: fs.readFileSync(PATH + f, 'utf8')
  }
})

// build content tree
_.each(files, f => {
  const parts = f.filename.split('/');
  if(_.size(parts) === 1)
    tree._files.push(f.filename);
  if(_.size(parts) === 2) {

    if(!tree[_.first(parts)])
      tree[_.first(parts)] = []

    tree[_.first(parts)].push(_.last(parts));
  }
});

const folders = _.keys(tree).filter(f => f !== '_files');

module.exports = { tree, files, folders };