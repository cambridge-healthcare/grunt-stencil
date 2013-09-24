var randoms = require('./randoms');

describe("include", function () {
  function from_cache (collection) {
    return function (name) {
      return collection[name];
    }
  }

  var include_setup = require('../lib/include');

  it("returns object representing partial's content", function () {
    var partials = { asdf: { a: 1 } };

    var include = include_setup({
      read: from_cache(partials),
      process: function (x) { return x; }
    });

    expect(include('asdf')).toEqual(partials.asdf);
  });

  it("detects circular dependencies", function () {
    var partials = {
      first: 'other',
      other: 'first'
    };

    var include = include_setup({
      read: from_cache(partials),
      process: function (name) { return include(name); }
    });

    expect(function () {
      include('first');
    }).toThrow(new Error('Circular dependency detected.'));
  });

  it("allows to include the same file multiple times", function () {
    var partials = {
      asdf: randoms.word()
    };

    var include = include_setup({
      read: from_cache(partials),
      process: function (x) { return x; }
    });

    expect(include('asdf') + include('asdf'))
      .toEqual(partials.asdf + partials.asdf);
  });
});
