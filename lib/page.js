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
      include: include_with_param
    });
  }

  function include_with_param (src, it) {
    return include(compile_include, src);

    function compile_include (src) {
      var template = dot.template(source.content(src));
      var header   = source.header(src);
      var content  = template(_.extend(header, it));

      return _.extend(header, {
        toString: function () {
          return content;
        }
      });
    }
  }
}
