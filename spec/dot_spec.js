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

  describe('extend_it', function() {
    it('can add parameters to the it object', function() {
      dot.extend_dotvar({qwer: 22});
      expect(dot.dotvar).toEqual({title: 'asdf', qwer: 22});
    });

    it('can override values in the it object', function() {
      dot.extend_dotvar({asdf: 1}, {title: 2});
      expect(dot.dotvar).toEqual({title: 2, asdf: 1});
    });
  });
});