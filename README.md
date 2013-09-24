# grunt-stencil

Stencil is a [Grunt](http://gruntjs.com/) plugin for templating that generates static HTML files from given components. Stencil provides the following:

- A way to modularise your HTML source files: each file can include an arbitrary number of partial files, or be wrapped with a template file.
- Built in support for [the doT.js templating language](http://olado.github.io/doT/index.html), which allows passing of arbitrary variables to your HTML files.
- Built in support for markdown
- Meta data headers in the beginning of each file to specify variables that should be used in the file (that are accessible from partials included in the file, or templates the file is injected into).

> See the [Wiki pages](https://github.com/cambridge-healthcare/grunt-stencil/wiki) for full documentation.

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

> A more detailed explanation of all options can be found in [the Wiki](https://github.com/cambridge-healthcare/grunt-stencil/wiki/Options).

Each of the following is optional.

#### options.dot_template_settings
Type: `Object`
Default value: `{}`

An object that specifies the template settings that are passed to the doT compiler as `dot.templateSettings` (see [doT.js](http://olado.github.io/doT/index.html)).

#### options.dot_it_object
Type: `Object`
Default value: `{}`

An object passed to all input files that will be accessible using `{{= it.key }}` (see [doT.js](http://olado.github.io/doT/index.html)).

#### options.dot_it_object.file_lists
Type: `Object'`
Default value: `{}`

An object of file matching patterns passed to all input files that is intended to be used for automated filepath generation. All keys should map to Arrays with two values that are used as arguments for [grunt.file.expand](https://github.com/gruntjs/grunt/wiki/grunt.file#gruntfileexpand) --- the first is an object with optional settings for `expand`, and the second is the actual pattern. For example, specifying

```
file_lists: {
  stylesheets: [{cwd: 'styles'}, '*.css']
}
```
will result in `it.file_lists.stylesheets` being evaluated to `['main.css', 'links.css']` (assuming these two files were present in the `styles` folder). See above for an example of how to define all style tags with a single doT expression.

#### options.templates_folder
Type: `String`
Default value: `''`

A String value specifying the location of all templates. When specified, this will allow to call templates in pages' meta data without the full path to it (the specified `templates_folder` will be prepended).

#### options.partials_folder
Type: `String`
Default value: `''`

A String value specifying the location of all partials. When specified, this will allow to call partial `include` functions without the full path (the specified `partials_folder` will be prepended).

#### options.meta_data_sep
Type: `String`
Default value: `\n\n`

A String value specifying the characters to search for when separating meta data from the content of a file. By default, the JSON header of a file is considered to end after the first blank line in the file.

### Usage Examples

> An elaborate list of examples can be found in [the Wiki](https://github.com/cambridge-healthcare/grunt-stencil/wiki/Examples).

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

#### Default Options
In this example, the default options are used.

```js
grunt.initConfig({
  stencil: {
    main: // task target name
    options: {},
    files: {
      'dist/index.html': ['pages/index.dot.html'],
    },
  },
})
```

#### Custom Options

In this example, doT's it object is used to specify the location of script files and the main title of all pages; and the location of partials and templates is given. All pages in `pages/` will be compiled to `.html` files in `tmp`.

```js
grunt.initConfig({
  stencil: {
    main: {
      options: {
        dot_it_object: {
          title: "Stencil",
          file_lists: {
            scripts: [{}, 'js/*.js']
          }
        }
        partials_folder: 'content',
        templates_folder: 'templates'
      },
      files: [
        {
          expand: true,
          cwd: 'src/pages/',
          src: '**/*.dot.html',
          dest: 'tmp',
          ext: '.html',
          flatten: true
        }
      ]
    },
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

- __version 0.0.3__ (19th September, 2013) - fix dependencies in `package.json`
- __version 0.0.2
- __version 0.0.1__ (16th September, 2013)
