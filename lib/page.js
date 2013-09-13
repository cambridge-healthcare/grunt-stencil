'use strict';

module.exports = setup;

var dot = require('dot');

function setup (source) {
  return function (src) {
    return dot.template(source.content(src))(source.header(src));
  }
}
