var marked = require('marked');
var _ = require('lodash');
var renderer = new marked.Renderer();
 
// add anchors
renderer.heading = function (text, level) {
  var escapedText = text
    .replace(/[^\w]+/g, '-')
    .split('-code-').join('-');
 
    if(escapedText[0] === "-")
      escapedText = escapedText.substr(1);

  return '<h' + level + '>' + text + ' <a name="' +
    escapedText +
     '" class="anchor" href="#' +
     escapedText +
     '"><span class="header-link">#</span></a>' +
     '</h' + level + '>';
};


// rewrite .md to .html
// add target=_blank if external
renderer.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return '';
    }
  }

  if(_.endsWith(href, '.md'))
    href = href.slice(0, -3) + '.html';

  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  if(_.startsWith(href, 'http')) {
    out += ' target="_blank"';
  }
  out += '>' + text + '</a>';
  return out;
};

module.exports = str => marked(str, { renderer: renderer })