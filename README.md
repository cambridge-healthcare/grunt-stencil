# grunt-stencil

Stencil is a [Grunt](http://gruntjs.com/) plugin for templating that generates static HTML files from given components. Stencil provides the following:

- A way to modularise your HTML source files: each file can include an arbitrary number of partial files, or be wrapped with a template file.
- Built in support for [the doT.js templating language](http://olado.github.io/doT/index.html), which allows passing of arbitrary variables to your HTML files.
- Built in support for markdown
- Meta data headers in the beginning of each file to specify variables that should be used in the file (that are accessible from partials included in the file, and templates the file is injected into).

## Documentation

See the __[Wiki pages](https://github.com/cambridge-healthcare/grunt-stencil/wiki)__ for full documentation.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-stencil --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-stencil');
```

## The "stencil" task

### Options

*A more detailed explanation of all options can be found in [the Wiki](https://github.com/cambridge-healthcare/grunt-stencil/wiki/Options).*

Each of the following is optional.

#### options.dot_template_settings
Type: `Object`
Default value: `{}`

An object that specifies the template settings that are passed to the doT compiler (see [doT.js](http://olado.github.io/doT/index.html)).

#### options.env
Type: `Object`
Default value: `{}`

Initial environment seen by all compiler, doT.js sees it as `it`. This environment is for each file with their header fields.

#### options.templates
Type: `String`
Default value: `"."`

A String value specifying the location of all templates. When specified, this will allow to call templates in pages' meta data without the full path to it (the specified `templates_folder` will be prepended).

#### options.partials
Type: `String`
Default value: `"."`

A String value specifying the location of all partials. When specified, this will allow to call partial `include` functions without the full path (the specified `partials_folder` will be prepended).

#### options.meta_data_separator
Type: `String`
Default value: `"\n\n"`

A String value specifying the characters to search for when separating meta data from the content of a file. By default, the JSON header of a file is considered to end after the first blank line in the file.

### Usage Examples

*An elaborate list of examples can be found in [the Wiki](https://github.com/cambridge-healthcare/grunt-stencil/wiki/Examples).*

In your project's Gruntfile, add a section named `stencil` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  stencil: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

[Grunt's rules for defining target and destination files](https://github.com/gruntjs/grunt/wiki/Configuring-tasks#files) apply, but care needs to be taken to make sure each input page maps to a single output file.

#### Custom Options

In this example, doT's it object is used to specify the location of script files and the main title of all pages; and the location of partials and templates is given. All pages in `pages/` will be compiled to `.html` files in `tmp`.

```js
grunt.initConfig({
  stencil: {
    main: {
      options: {
        env: {
          title: "Stencil",
        },
        partials: "content",
        templates: "templates"
      },
      files: [
        {
          expand: true,
          cwd: "src/pages/",
          src: "**/*.dot.html",
          dest: "tmp",
          ext: ".html",
          flatten: true
        }
      ]
    },
  }
})
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code using [Grunt](http://gruntjs.com/). Please ignore W092 errors (wrapping regexps). The warning will show up until there's an option to disable it in jshint.

You can runt the test suite with `grunt test` or `grunt testv` for more verbose output.

## Release History

- __version 1.0.0__ (7th October, 2013) - first stable release
- __version 0.1.0__ (4th October, 2013) - big refactor and change of specification
- __version 0.0.3__ (19th September, 2013) - fix dependencies in `package.json`
- __version 0.0.2__
- __version 0.0.1__ (16th September, 2013)
