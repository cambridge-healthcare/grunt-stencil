"use strict";

/*
 * A set of functions to parse file sources
 * into meta data headers and actual content
 */

module.exports = setup;

var _ = require("underscore");

function setup (separator) {
  return {
    header: with_chunks(header),
    content: with_chunks(content)
  };

  function header (chunks) {
    var header_chunk = chunks[0];
    return has_meta_data(header_chunk) ? JSON.parse(header_chunk) : {};
  }

  function content (chunks) {
    return (has_meta_data(chunks[0]) ? chunks.slice(1) : chunks).join(separator);
  }

  function with_chunks (fn) {
    return function (text) {
      return fn(split(text));
    };
  }

  function split (text) {
    return text.split(separator);
  }

  function has_meta_data (chunk) {
    return /^\{(?!\{)/.test(chunk);
  }
}
