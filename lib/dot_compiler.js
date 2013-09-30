'use strict';

/*
 * A dot compiler that uses the given dotvar
 * and template settings to compile a dot string
 */

module.exports = setup;

var dot = require('dot');
var _ = require('underscore');

function setup (config) {
  var dotvar = config.dotvar || {};
  var template_settings = config.template_settings || {};

  return {
    compile: compile
  };

  function compile (src) {
    var settings = _.extend({}, dot.templateSettings, template_settings);
    var template = dot.template(src, settings);
    return template(dotvar);
  };

}
