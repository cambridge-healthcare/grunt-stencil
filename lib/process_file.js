'use strict';

module.exports = setup;

var _ = require('underscore');

function setup (config) {

  var options = config.options || {};
  var read_header = config.read_header;
  var compile = config.compile;
  var find_closest_match = config.find_closest_match;

  var processed = {};

  var process_page    = process_file.bind(null, '.');
  var process_partial = process_file.bind(null, options.partials);

  var template_params_init = _.extend({}, options.vars, { include: process_partial });

  return process_page;

  function process_file (folder, filename, params) {

    var input_file = find_closest_match(folder, filename);

    if (processed[input_file]) throw new Error('Circular dependency detected.');
    processed[input_file] = true;

    var compiled_page = page(input_file, params);

    delete processed[input_file];

    return compiled_page;
  };

  function page (input_file, params) {
    var header = read_header(input_file);
    var content = compile(input_file, bundle_template_params(header, params));
    return bundle_page(content, header);
  }

  function bundle_template_params () {
    return _.flatten([
      template_params_init,
      arguments
    ]).reduce(function (agg, value) {
      return _.extend(agg, value);
    }, {});
  }

  function bundle_page (str, parameters) {
    return _.extend(parameters, {
      valueOf:  function () { return str; },
      toString: function () { return str; }
    });
  }
}
