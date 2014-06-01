"use strict";

/*
 * A dot compiler that uses the given dotvar
 * and template settings to compile a dot string.
 *
 * An applies_to function is provided to test against
 * input files that require this compiler
 */

module.exports = setup;

var dot = require("dot");
var _ = require("underscore");

function setup (config) {
  var dotvar = config.dotvar || {};
  var template_settings = config.template_settings || {};

  return {
    compile: compile,
    applies_to: applies_to
  };

  function compile (src, params) {
    var settings = _.extend({}, dot.templateSettings, template_settings);
    var template = dot.template(src, settings);
    return template(_.extend({}, dotvar, params));
  }

  function applies_to (file_path) {
    return /\.dot(\.|$)|\.html$/.test(file_path);
  }

}
