'use strict';

module.exports = page;

var dot = require('dot');

function page (src) {
  return dot.template(src)();
}
