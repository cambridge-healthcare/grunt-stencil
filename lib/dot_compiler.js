'use strict';

/*
 * A dot compiler that uses the given dotvar
 * and template settings to compile a dot string
 */

module.exports = setup;

var dot = require('dot');
var _ = require('underscore');

function setup (config) {

  this.dotvar = config.dotvar || {};
  this.template_settings = config.template_settings || {};

  this.compile = function(src) {
    _.extend(dot.templateSettings, this.template_settings);
    var template = dot.template(src);
    return template(this.dotvar);
  };

  this.extend_dotvar = function () {
    var dot = this;
    _.flatten(_.values(arguments)).forEach(function(params) {
      _.extend(dot.dotvar, params);
    });
  };
}