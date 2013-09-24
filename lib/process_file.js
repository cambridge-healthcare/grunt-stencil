module.exports = setup;

function setup (config) {
  var processed = {};

  if (config.process) {
    return process_file.bind(null, config.read, config.process);
  } else {
    return process_file.bind(null, config.read);
  }

  function process_file (read, processor, file) {
    if (processed[file]) {
      throw new Error('Circular dependency detected.');
    }

    processed[file] = true;

    var result = processor(read(file));

    delete processed[file];

    return result;
  }
}
