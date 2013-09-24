module.exports = setup;

function setup (config) {
  var included = {};

  if (config.process) {
    return include.bind(null, config.read, config.process);
  } else {
    return include.bind(null, config.read);
  }

  function include (read, process, file) {
    if (included[file]) {
      throw new Error('Circular dependency detected.');
    }

    included[file] = true;

    var result = process(read(file));

    delete included[file];

    return result;
  }
}
