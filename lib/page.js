'use strict';

var _ = require('underscore');

module.exports = setup;

var dot = require('dot');

function setup (config) {
  var source = config.source;
  var process_file = config.process_file;

  return page;

  function page (src) {
    return dot.template(source.content(src))(it(src));
  }

  function it (src) {
    return _.extend(source.header(src), {
      include: source_representation
    });
  }

  function source_representation (filename, it) {
    return process_file(compiler, filename);

    function compiler (src) {
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
