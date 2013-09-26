'use strict';

/*
 * This module takes the source of a file,
 * a list of compilers to be applied to it,
 * and applies the compilers to the source in
 * the given order.
 *
 * It then packages the compiled source into an
 * object that also includes the header fields
 * found in the source (parsed by a given parser)
 */

module.exports = setup;

var _ = require('underscore');

function setup (config) {
  var compilers = config.compilers || [];
  var parse = config.parser;

  return page;

  function page (src) {
    var header = parse.header(src);
    var compiled_src = apply_compilers(parse.content(src));
    return pack_up(compiled_src, header);
  }

  function apply_compilers (src) {
    var result = src
    compilers.forEach(function(compiler) {
      result = compiler.compile(result);
    });
    return result;
  };

  function pack_up (str, parameters) {
    return _.extend(parameters, {
      toString: function () {
        return str;
      }
    });
  }
}
