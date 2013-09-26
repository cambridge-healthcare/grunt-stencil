'use strict';

var dot = require('dot');
var _ = require('underscore');

module.exports = setup;

function setup (config) {

  this.it = config.it;
  this.template_settings = config.template_settings;

  this.compile = function(src) {
    _.extend(dot.templateSettings, this.template_settings);
    var template = dot.template(src);
    return template(this.it);
  };

  this.extend_it = function () {
    var dot = this;
    _.values(arguments).forEach(function(params) {
      _.extend(dot.it, params);
    });
  };
}