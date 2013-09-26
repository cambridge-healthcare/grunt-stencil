'use strict';

module.exports = setup;

var _ = require('underscore');
var dot = require('dot');

function setup (config) {
  var parse = config.parse;
  var process_file = config.process_file;

  return page;

  function page (src) {
    return compile(src).toString();
  }

  function compile (src, params) {
    var template = dot.template(parse.content(src));
    var header   = parse.header(src);
    var content  = template(it(src, params));

    return _.extend(header, {
      toString: function () {
        return content;
      }
    });
  }

  function it (src, params) {
    return _.extend(parse.header(src), {
      include: process_file.bind(null, compile)
    }, params);
  }
}
