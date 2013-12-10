"use strict";

/*
 * This module is responsible for logic that decides if a file has a
 * template and what's the template name.
 */

module.exports = setup;

function setup (config) {
  var read_header = config.read_header;
  var match_glob = config.match_glob;
  var template_map = config.template_map || [];

  return template_of;

  function template_of (name) {
    var header = read_header(name);
    return header.template;
  }
}
