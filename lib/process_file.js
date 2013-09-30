'use strict';

module.exports = setup;

var _ = require('underscore');
var file = require('./file');

function setup (config) {

  var options = config.options || {};
  var parse   = require('./parse')(options.meta_data_separator);

  var processed = {};

  var process_page    = process_file.bind(null, config.read, '.'),
      process_partial = process_file.bind(null, config.read, options.partials);

  var dotvar_defaults = _.extend({}, options.dotvar, { include: process_partial });

  return process_page;

  function process_file (read, folder, filename, params) {

    var input_file = file.find_closest_match(folder, filename);
    var src = read(input_file);

    if (processed[input_file]) throw new Error('Circular dependency detected.');
    processed[input_file] = true;

    var page = require('./page')({
      compilers: require('./compilers')({
        dotvar: bundle_dotvar(parse.header(src), params),
        dot_settings: options.dot_template_settings
      })(input_file),
      parser: parse
    });

    var result = page(src);

    delete processed[input_file];
    return result;
  };

  function bundle_dotvar () {
    return _.flatten([
      dotvar_defaults,
      arguments
    ]).reduce(function (agg, value) {
      return _.extend(agg, value);
    }, {});
  }
}
