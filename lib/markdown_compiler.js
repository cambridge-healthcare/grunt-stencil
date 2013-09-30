"use strict";

/*
 * A simple markdown compiler.
 *
 * An applies_to function is provided to test against
 * input files that require this compiler
 */

module.exports = {
  applies_to: applies_to,
  compile: compile
};

var md = require("marked");

function compile (src) {
  return md(src);
}

function applies_to (file_path) {
  return /\.md$|\.md\./.test(file_path);
}
