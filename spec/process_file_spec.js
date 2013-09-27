var random = require('./random');
var file = require('../lib/file')
var process_file = require('../lib/process_file');

describe("process_file", function () {

  var process;
  beforeEach(function() {
    process = process_file({
      read: file.read,
      options: {meta_data_separator: '\n\n'}
    });
  });

  it("finds files given without extensions", function() {
    expect(process('spec/fixtures/html_only').toString())
      .toEqual('Just HTML here');
  });


  describe("when converted to a string", function() {
    it("returns the contents of a file", function () {
      expect(process('spec/fixtures/html_with_header.html').toString())
        .toEqual('<p>Just HTML here</p>');
    });
  });

  describe("when the file includes partial(s)", function() {

    beforeEach(function() {
      process = process_file({
        read: file.read,
        options: {meta_data_separator: '\n\n',
                  partials: 'spec/includes'}
      });
    });

    it("can process nested inclusions", function() {
      expect(process('spec/fixtures/nested_include.dot.html').toString())
        .toEqual('Content of example.html\n');
    });

    it("allows including the same partial twice in one file", function () {
      expect(process('spec/fixtures/includes_partial_twice.dot.html').toString())
        .toEqual('Content of example.html\n<p>One more time</p>Content of example.html\n');
    });

    it("detects circular dependencies in partials", function () {
      expect(function () {
        process('spec/includes/example_with_circular_include.dot.html');
      }).toThrow(new Error('Circular dependency detected.'));
    });

    describe("when the partials folder is given in the options", function() {
      it("identifies included partials by filename only", function() {
        expect(process('spec/fixtures/includes_partial').toString())
          .toEqual('Content of example.html\n');
      });
    });

  });

  describe("when the file requires a dot compiler", function() {

    beforeEach(function() {
      process = process_file({
        read: file.read,
        options: {meta_data_separator: '\n\n',
                  partials: 'spec/includes',
                  dotvar: {parameter: 'param_value'}}
      });
    });

    it("uses data from the given dotvar", function() {
      expect(process('spec/fixtures/custom_dotvar.dot.html').toString())
        .toEqual('param_value');
    });

    it("saves data from the header in the dotvar", function () {
      expect(process('spec/fixtures/with_header').toString()).toEqual('<p>asdf</p>');
    });

    it("saves data from given params in the dotvar", function() {
      expect(process('spec/fixtures/include_with_params.dot.html').toString())
        .toEqual('asdf');
    });

    it("has acces to meta data fields of an included partial", function () {
      expect(process('spec/fixtures/gets_param_from_partial.dot.html').toString())
        .toEqual('title');
    });

  });

});
