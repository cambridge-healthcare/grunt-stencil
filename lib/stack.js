'use strict';

module.exports = function () {
  this.elements = [];

  this.contains = function(element) {
    if (this.elements.indexOf(element) != -1) {
      return true;
    }
    else {
      return false;
    }
  };

  this.add = function(element) {
    this.elements.push(element);
  };

  this.remove = function(element) {
    var index_to_remove = this.elements.indexOf(element);
    this.elements.splice(index_to_remove, 1);
  }
}