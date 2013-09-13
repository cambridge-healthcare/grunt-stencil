var _ = require('underscore');

module.exports = setup;

function setup (separator) {

  return {
    parsed: parsed,
    header: header,
    content: content
  };

  function parsed (text) {
    var chunks = text.split(separator);
    return _.extend(meta_data(chunks),
                    { toString: function () {
                        return content(chunks).join(separator);
                    } });
  }

  function header (text) {

  }

  function content (text) {

  }
}

function has_meta_data (chunk) {
  return chunk[0] === '{';
}

function meta_data (chunks) {
  var header = chunks[0];
  return has_meta_data(header) ? JSON.parse(header) : {};
}

function content (chunks) {
  return has_meta_data(chunks[0]) ? chunks.slice(1) : chunks;
}