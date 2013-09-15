module.exports = setup;

function setup (config) {
  var included = {};

  if (config.process) {
    return include.bind(null, config.read, config.process);
  } else {
    return include.bind(null, config.read);
  }

  function include (read, process, name) {
    if (included[name]) {
      throw new Error('Circular dependency detected.');
    }

    included[name] = true;

    var result = process(read(name));

    delete included[name];

    return result;
  }
}
