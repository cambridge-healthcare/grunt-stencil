var randoms = require('./randoms');

describe("process_file", function () {
  function from_cache (collection) {
    return function (name) {
      return collection[name];
    }
  }

  var process_file_setup = require('../lib/process_file');

  it("returns object representing the content of a partial", function () {
    var partials = { asdf: { a: 1 } };

    var process_file = process_file_setup({
      read: from_cache(partials),
      process: function (x) { return x; }
    });

    expect(process_file('asdf')).toEqual(partials.asdf);
  });

  it("detects circular dependencies", function () {
    var partials = {
      first: 'other',
      other: 'first'
    };

    var process_file = process_file_setup({
      read: from_cache(partials),
      process: function (name) { return process_file(name); }
    });

    expect(function () {
      process_file('first');
    }).toThrow(new Error('Circular dependency detected.'));
  });

  it("allows to process the same file multiple times, if they do not depend on each other", function () {
    var partials = {
      asdf: randoms.word()
    };

    var process_file = process_file_setup({
      read: from_cache(partials),
      process: function (x) { return x; }
    });

    expect(process_file('asdf') + process_file('asdf'))
      .toEqual(partials.asdf + partials.asdf);
  });
});
