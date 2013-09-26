'use strict';

module.exports = setup;

var parse = require('./parse')('\n\n');
var _ = require('underscore');

function setup (config) {
  var options = config.options;

  var dot = new (require('./dot_compiler'))({
    dotvar: options.dot_it_obj,
    template_settings: options.dot_template_settings
  })

  var markdown = {
    compile: function(x) { return x; }
  }

  var processed = {};

  return process_file.bind(null, config.read, '.');

  function process_file (read, folder, file, params) {
    if (processed[file]) {
      throw new Error('Circular dependency detected.');
    }


    processed[file] = true;

    extend_dotvar(parse.header(read(file, folder)), params);

    var page = require('./page')({
      compilers: assign_compilers(file),
      parser: parse
    });

    var result = page(read(file, folder));

    delete processed[file];

    return result;
  }

  function extend_dotvar () {
    dot.extend_dotvar(_.values(arguments));
    dot.extend_dotvar({
      include: process_file.bind(null, config.read, options.partials)
    })
  }

  function assign_compilers (file) {
    var compilers = [dot];
    if (is_markdown (file)) compilers.unshift(markdown);
    return compilers;
  }

  function is_markdown (file) {
    return /\.md$/.test(file);
  }

  function has_extension (path) {
    return path.match(/\.[0-9a-z]+$/i);
  }

}
