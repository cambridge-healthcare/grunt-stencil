# grunt-stencil

> A Grunt plugin to generate static HTML files from given components.

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

### Overview

Stencil is a feature-rich Grunt plugin for compiling static HTML templates from given components, which supports [the doT.js templating language](http://olado.github.io/doT/index.html) as well as markdown. It is useful for modularizing your HTML source files, avoiding duplicate code, and passing any arbitrary variables or data to your templates.

### Template components

Stencil generates HTML output files out of the following components.

#### Pages

Pages are the input files given to stencil which map directly to output files (for each given page, a single output file is compiled). Pages can be written in pure HTML or markdown, and include both doT variables as well as a JSON header to hold any required meta data about that page. Using a built-in `include` function in doT's `it` object, a page can include the compiled contents of any partial; and a page can be assigned a template in it's JSON meta data header that will be wrapped around it in the final stages of compilation.

The following page, for example, will include the compiled source of both `footer.md` and `navigation.dot.html`, and will be injected into the template `default.dot.html`. Note that specifying file extensions to both partials and templates is optional.

__page.html:__

```html
{
  "body_class": "main",
  "title": "Welcome",
  "template": "default"
}

<div class="wrapper">
  {{= it.include('navigation') }}

  <div class="content">
    Content
  </div>

  {{= it.include('footer') }}
</div>
```

__default.dot.html:__

```html
<html>
  <head>
    <title>{{= it.title }}</title>
  </head>
  <body>
    <!-- Use the document key to specify where a page should be included into a template -->
    {{= it.document }}
  </body>
</html>
```

#### Partials

Partials are small files to hold chunks of content that can be shared by many pages. Partials can, too, be written in both pure HTML, markdown, and include doT variables and a meta data header, and they can also include other partials. A simplified __footer.md__ partial might look as follows:

```md
__Copyright 2013 Stencil__

*{{= it.include('contact_information') }}*
```

#### Templates

Templates are HTML wrapper files that can be used to avoid rewriting `head` tags, script and style tags, headers or other code that pages might share. To specify where the contents of a page should be injected inside a template, `{{= it.document }}` should be used.

The following example shows how to automatically add tags for stylesheets in the `head` of a template (see options for an explanation of `file_lists`). The `title` and `body_class` variables are inherited from the included page's meta data header.

```html
<html>
  <head>
    <title>{{= it.title }}</title>
    {{~it.file_lists.stylesheets :src}}
    <link rel="stylesheet" type="text/css" href="../{{= src }}">
    {{~}}
  </head>
  <body class="{{= it.body_class }}">
    {{= it.document }}
  </body>
</html>
```

### Defining and using meta data headers

All pages and partials can have meta data headers to pass arbitrary information to the template. At the moment, the headers need to be written in JSON, but the separator that specifies where the header ends and content begins can be customized in the options (by default, the file will be separated from the first occurrence of a blank line, the separator being `\n\n`).

Meta data fields can also be accessed by files that don't directly include the partial where the value is defined. For example, to include the field `contact_styles` from the partial `contact.dot.html` in  `footer.md`, one would use `{{= it.include('contact', 'contact_styles') }}`, and the value from that field will be included in the footer.

### Using doT and markdown

doT expressions, HTML and markdown may be combined freely in any page or partial. The compiler will first convert any doT expressions that were found, and then runs the content through a markdown compiler, so the following code is a valid page:

```md
{
  "title": "Contact information",
  "body_class": "contact",
  "template": "default",
}

# Contact information

{{= it.include('contact') }}

<footer>
  {{= it.include('footer') }}
</footer>
```

It does need to be kept in mind that the markdown compiler will insert a `<p></p>` for newlines, and avoiding newlines results in decreased legibility, so care should be taken when extensively combining markdown and HTML.

Finally, while specifying template and partial file extensions is optional (there is no difference between `{{= it.include('footer.md') }}` and `{{= it.include('footer') }}`), the markdown compiler will only be run if the extension of a given file is `.md`.

## Options

Each of the following is optional.

### options.dot_template_settings
Type: `Object`
Default value: `{}`

An object that specifies the template settings that are passed to the doT compiler as `dot.templateSettings` (see [doT.js](http://olado.github.io/doT/index.html)).

### options.dot_it_object
Type: `Object`
Default value: `{}`

An object passed to all input files that will be accessible using `{{= it.key }}` (see [doT.js](http://olado.github.io/doT/index.html)).

### options.dot_it_object.file_lists
Type: 'Object'
Default value: `{}`

An object of file matching patterns passed to all input files that is intended to be used for automated filepath generation. All keys should map to Arrays with two values that are used as arguments for [grunt.file.expand](https://github.com/gruntjs/grunt/wiki/grunt.file#gruntfileexpand) --- the first is an object with optional settings for `expand`, and the second is the actual pattern. For example, specifying

```
file_lists: {
  stylesheets: [{cwd: 'styles'}, '*.css']
}
```
will result in `it.file_lists.stylesheets` being evaluated to `['main.css', 'links.css']` (assuming these two files were present in the `styles` folder). See above for an example of how to define all style tags with a single doT expression.

### options.templates_folder
Type: `String`
Default value: `''`

A String value specifying the location of all templates. When specified, this will allow to call templates in pages' meta data without the full path to it (the specified `templates_folder` will be prepended).

### options.partials_folder
Type: `String`,
Default value: `''`

A String value specifying the location of all partials. When specified, this will allow to call partial `include` functions without the full path (the specified `partials_folder` will be prepended).

## Usage Examples

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

### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  stencil: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  stencil: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

- __version 0.0.1__ (16th September, 2013)
