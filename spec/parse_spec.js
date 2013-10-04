"use strict";

describe("parse", function () {
  var separator = "\n\n";
  var meta_data = {
    field: "value"
  };
  var content = "This is the content of a file.";
  var src = JSON.stringify(meta_data) + separator + content;
  var parse = require("../lib/parse")(separator);

  describe(".content", function() {
    it("returns the contents of a given source as a string", function() {
      expect(parse.content(src)).toEqual(content);
    });

    it("returns an empty string if the source consisted only of meta data", function() {
      src = JSON.stringify(meta_data);
      expect(parse.content(src)).toEqual("");
    });

    describe("when source has no meta data", function(){
      var src = content;

      it("returns complete contents of the source", function() {
        expect(parse.content(src)).toEqual(src);
      });
    });
  });

  describe(".header", function() {
    it("returns the JSON meta data object of a given source", function() {
      expect(parse.header(src)).toEqual(meta_data);
    });

    describe("when the source did not contain meta data", function () {
      it("returns an empty object", function() {
        var src = content;
        expect(parse.header(src)).toEqual({});
      });
    });
    describe("when the source begins with doT syntax", function () {
      it("returns an empty object", function () {
        var src = "{{";
        expect(parse.header(src)).toEqual({});
      })
    });
  });
});
