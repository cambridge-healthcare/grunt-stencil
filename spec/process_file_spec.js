var random = require('./random');
var file = require('../lib/file')
var process_file = require('../lib/process_file');

describe("process_file", function () {

  it("finds files given without extensions", function() {
    var process = process_file({
      read: file.read,
      options: {meta_data_separator: '\n\n'}
    });
    expect(process('spec/fixtures/html_only').toString())
      .toEqual('Just HTML here');
  });

  it("detects circular dependencies in partials", function () {
    var process = process_file({
      read: file.read,
      options: {meta_data_separator: '\n\n'}
    });

    expect(function () {
      process('spec/includes/example_with_circular_include.dot.html');
    }).toThrow();
  });

  describe("when converted to a string", function() {

    var process;
    beforeEach(function() {
      process = process_file({
        read: file.read,
        options: {meta_data_separator: '\n\n'}
      });
    });

    it("returns the contents of a file", function () {
      expect(process('spec/fixtures/html_with_header.html').toString())
        .toEqual('<p>Just HTML here</p>');
    });

    it("returns the compiled contents of a file", function() {
      expect(process('spec/fixtures/with_header.md.dot.html').toString())
        .toEqual('<p>asdf</p>');
    });

  });

  xdescribe("when the partials folder is given in the options", function() {

    it("identifies included partials by filename only", function() {
      var process = process_file({
        read: file.read,
        options: {meta_data_separator: '\n\n',
                  partials: 'spec/includes'}
      });

      expect(process('spec/fixtures/includes_partial').toString())
        .toEqual('Content of example.html\n');
    });

  });

  xit("allows to process the same file multiple times, if they do not depend on each other", function () {
    var partials = {
      asdf: randoms.word()
    };

    var process = process_file({
      read: from_cache(partials),
      options: {}
    });

    expect(process('asdf') + process('asdf'))
      .toEqual(partials.asdf + partials.asdf);
  });

  //===============================================

  xit("passes data from the header to the content", function () {
    var title = random.word();
    var header = JSON.stringify({
      title: title
    });

    var content = '{{= it.title }}';
    expect(page(header + content)).toEqual(title);
  });

  xdescribe("when it has an 'include' statement", function() {

    it("includes a partial", function () {
      var content = '{{= it.include("asdf") }}';
      expect(page(content)).toEqual(partials.asdf);
    });

    it("has acces to meta data from the included partial", function () {
      var content = '{{= it.include("qwer").a }}';
      expect(page(content)).toEqual('1');
    });

    it("compiles the partial with doT", function () {
      var content = '{{= it.include("dotted") }}';
      expect(page(content)).toEqual('asdf');
    });

    it("can specify extra parameters to be passed to the partial", function () {
      var content = '{{= it.include("dotted_w_params", {title:"asdf"}) }}';
      expect(page(content)).toEqual('asdf');
    });

    it("can process other include statements inside this one", function() {
      var content = '{{= it.include("nested_include") }} Hello';
      expect(page(content)).toEqual(partials.asdf + ' Hello');
    });
  });
});
