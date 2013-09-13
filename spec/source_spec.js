xdescribe("The source module", function () {
  var separator = '\n\n';
  var meta_data = {
    field: "value"
  };
  var content = "This is the content of a file.";
  var src = JSON.stringify(meta_data) + separator + content;
  var source = require('../lib/source')(separator);

  describe(".content", function() {
    it("returns the contents of a given source as a string", function() {
      expect(source.content(src)).toEqual(content);
    });

    it("returns an empty string if the source consisted only of meta data", function() {
      src = JSON.stringify(meta_data);
      expect(source.content(src)).toEqual('');
    });

    describe("when source has no meta data", function(){
      var src = content;

      it("returns complete contents of the source", function() {
        expect(source.content(src).toEqual(src));
      });
    });
  });

  describe(".header", function() {
    it("returns the JSON meta data object of a given source", function() {
      expect(source.header(src)).toEqual(meta_data);
    });

    it("returns an empty object if the source did not contain meta data", function() {
      src = content;
      expect(source.header(src)).toEqual({});
    });

    it("returns exactly what was given if the source had no content", function() {

    });
  });

  describe("when requesting for the source to be parsed", function () {
    describe("when accessing any field", function () {
      it("shouldn't throw an error", function () {
        expect(function () {
          source.parsed('').asdf;
        }).not.toThrow();
      });
    });

    describe("when concatenating to any string", function () {
      it("concatenates content in", function () {
        var content = 'asdf';
        expect('' + source.parsed(content)).toEqual(content);
      });
    });

    describe("when there's no meta data", function () {
      it("toString() returns given text", function () {
        var content = 'fghjkl';
        expect(source.parsed(content).toString()).toEqual(content);
      });
    });

    describe("when there's meta data", function () {

      var content = 'content';
      var text = JSON.stringify(meta_data) + separator + content;

      it("has access to any meta data field", function () {
        expect(source.parsed(text).field).toEqual('value');
      });
    });
  });
});