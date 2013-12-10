"use strict";

/*
 * A set of functions to parse file sources
 * into meta data headers and actual content
 */

module.exports = setup;

function setup (separator) {
  return {
    header: with_chunks(header),
    content: with_chunks(content)
  };

  function header (chunks) {
    return chunks.header ? JSON.parse(chunks.header) : {};
  }

  function content (chunks) {
    return chunks.content;
  }

  function with_chunks (fn) {
    return function (text) {
      return fn(split(text));
    };
  }

  function split (text) {
    if (has_meta_data(text)) {
      var match = text.match(separator);
      return (match
              ? {
                header: text.substring(0, match.index),
                content: text.substring(match.index + match[0].length)
              } : {
                header: text,
                content: ""
              });
    } else {
      return { content: text };
    }
  }

  function has_meta_data (chunk) {
    return /^\{(?!\{)/.test(chunk);
  }
}
