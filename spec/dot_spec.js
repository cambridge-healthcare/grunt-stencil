var random = require('./random');

describe('dot_compiler', function() {

  var fixt = {
    word: random.word(),
    qwer: '{"a":1}',
    dotted: '{{= "asdf" }}',
    dotted_w_params: '{{= it.title }}',
    nested_include: '{{= it.include("asdf") }}'
  };

  var dot = new (require('../lib/dot_compiler'))({
    dotvar: {title: 'asdf'},
    template_settings: {}
  });

  beforeEach(function() {
    dot.dotvar = {title: 'asdf'};
  })

  it('compiles dot templates', function() {
    var content = '{{= "' + fixt.word + '" }}';
    expect(dot.compile(content)).toEqual(fixt.word);
  });
});
