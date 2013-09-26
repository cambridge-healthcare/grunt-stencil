'use strict';

module.exports = {

  is_markdown: function (file) {
    return /\.md$/.test(file);
  },

  has_extension: function (file) {
    return file.match(/\.[0-9a-z]+$/i);
  }

}