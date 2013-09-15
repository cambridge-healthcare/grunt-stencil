'use strict';

var _ = require('underscore');

module.exports = setup;

var dot = require('dot');

function setup (config) {
  var source = config.source;
  var include = config.include;

  return page;

  function page (src) {
    return dot.template(source.content(src))(it(src));
  }

  function it (src) {
    return _.extend(source.header(src), {
      include: include.bind(null, source.parsed)
    });
  }
}
