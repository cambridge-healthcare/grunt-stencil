var Stack = require('../lib/stack.js');

describe("A Stack", function() {
  var stack;

  beforeEach(function() {
    stack = new Stack;
  });

  it("is initialised with an empty elements array", function() {
    expect(stack.elements).toEqual([]);
  });

  it("can add elements to itself", function() {
    stack.add(1);
    expect(stack.elements).toContain(1);
    expect(stack.elements).toEqual([1]);
  });

  it("can add duplicate elements to itself", function() {
    stack.elements = ["a", "b"];
    stack.add("b");
    expect(stack.elements).toEqual(["a", "b", "b"]);
  });

  it("can remove elements from itself", function() {
    stack.elements = [1,2,3];
    stack.remove(1);
    expect(stack.elements).not.toContain(1);
    expect(stack.elements).toEqual([2,3]);
  });

  it("stays the same when removing elements that aren't there", function() {
    stack.elements = [1,2,3];
    stack.remove(5);
    expect(stack.elements).toEqual([1,2,3]);
  });

  it("knows whether it contains an element", function() {
    stack.elements = ["a", "b", "c"];
    var knowledge = stack.contains("b");
    expect(knowledge).toBeTruthy();
  });
});