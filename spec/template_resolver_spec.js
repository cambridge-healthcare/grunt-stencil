"use strict";

describe("template_resolver", function () {
  var grunt = require("grunt");
  var template_resolver_setup = require("../lib/template_resolver");

  it("does not throw without parameters", function() {
    expect(function () {
      var resolve_template = template_resolver_setup();
      resolve_template();
    }).not.toThrow();
  });

  describe("with empty map", function () {
    var resolve_template = template_resolver_setup([]);
    it("won't overwrite existing template", function () {
      var header = { template: 'sometemplate' };
      resolve_template(header, 'somefile');
      expect(header.template).toBe('sometemplate');
    });

    it("won't set a template", function () {
      var header = {};
      resolve_template(header, 'somefile');
      expect(header.template).toBeUndefined();
    });
  });

  describe("with a single mapping", function () {
    var resolve_template = template_resolver_setup([{
      match:'spec/expected/with_*',
      template:'only_template'
    }]);
    describe("and a matching file", function () {
      it("won't overwrite existing template", function () {
        var header = { template: 'sometemplate' };
        resolve_template(header, 'spec/expected/with_header.html');
        expect(header.template).toBe('sometemplate');
      });

      it("will set mapped template", function () {
        var header = {};
        resolve_template(header, 'spec/expected/with_header.html');
        expect(header.template).toBe('only_template');
      });
    });
    describe("and a non-matching file", function () {
      it("won't overwrite existing template", function () {
        var header = { template: 'sometemplate' };
        resolve_template(header, 'spec/expected/html_only.html');
        expect(header.template).toBe('sometemplate');
      });

      it("won't set a template", function () {
        var header = {};
        resolve_template(header, 'spec/expected/html_only.html');
        expect(header.template).toBeUndefined();
      });
    });
  });

  describe("with multiple mappings", function () {
    var resolve_template = template_resolver_setup([{
      match:'spec/expected/*_only.html',
      template:'first_template'
    },{
      match:'spec/expected/*dot*.html',
      template:'second_template'
    }]);
    describe("and a file matching only first mapping", function () {
      it("won't overwrite existing template", function () {
        var header = { template: 'sometemplate' };
        resolve_template(header, 'spec/expected/html_only.html');
        expect(header.template).toBe('sometemplate');
      });

      it("will set mapped template", function () {
        var header = {};
        resolve_template(header, 'spec/expected/html_only.html');
        expect(header.template).toBe('first_template');
      });
    });
    describe("and a file matching only second mapping", function () {
      it("won't overwrite existing template", function () {
        var header = { template: 'sometemplate' };
        resolve_template(header, 'spec/expected/custom_dotvar.html');
        expect(header.template).toBe('sometemplate');
      });

      it("will set mapped template", function () {
        var header = {};
        resolve_template(header, 'spec/expected/custom_dotvar.html');
        expect(header.template).toBe('second_template');
      });
    });
    describe("and a file matching multiple mappings", function () {
      it("won't overwrite existing template", function () {
        var header = { template: 'sometemplate' };
        resolve_template(header, 'spec/expected/dot_only.html');
        expect(header.template).toBe('sometemplate');
      });

      it("will set mapped template to last mapping", function () {
        var header = {};
        resolve_template(header, 'spec/expected/dot_only.html');
        expect(header.template).toBe('second_template');
      });
    });
    describe("and a non-matching file", function () {
      it("won't overwrite existing template", function () {
        var header = { template: 'sometemplate' };
        resolve_template(header, 'spec/expected/with_header.html');
        expect(header.template).toBe('sometemplate');
      });

      it("won't set a template", function () {
        var header = {};
        resolve_template(header, 'spec/expected/with_header.html');
        expect(header.template).toBeUndefined();
      });
    });
  });
});