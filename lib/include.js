module.exports = setup;

function setup (config) {
  var read = config.read;
  var process = config.process;

  var included = {};

  return function include (name) {
    if (included[name]) {
      throw new Error('Circular dependency detected.');
    }

    included[name] = true;

    var result = process(read(name));

    delete included[name];

    return result;
  }
}
