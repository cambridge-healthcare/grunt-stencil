'use strict';

module.exports = {
  applies_to: applies_to,
  compile: compile
};

var md = require('marked');

function compile (src) {
  return md(src);
}

function applies_to (file_path) {
  return /\.md$|\.md\./.test(file_path);
}
