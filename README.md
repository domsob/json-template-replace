# json-template-replace

> This plugin allows you to replace placeholders defined in a JSON object. So you can define a template and integrate e.g. external services or just local JSON data.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install json-template-replace --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('json-template-replace');
```

## The "json-template-replace" task

### Overview
In your project's Gruntfile, add a section named `json-template-replace` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'json-template-replace': {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.separator
Type: `String`
Default value: `''`

A string value that is used between concatenated files.

#### options.prefix
Type: `String`
Default value: `'###'`

A string value that is used as prefix of every placeholder.

#### options.suffix
Type: `String`
Default value: `'###'`

A string value that is used as suffix of every placeholder.

#### options.replace
Type: `Object`
Default value: `{}`

A special JSON object where the replacements are defined. This object will be explained in detail in the following sections.


### Usage Examples

#### Default Options
In this example, the default options are used. Thus, no replacements are defined and the task executes a simple concatenation of files. In this example the task concatenates `header.html` and `template.html`. The combined file is `default_options.html`.

```js
grunt.initConfig({
  'json-template-replace': {
    options: {},
    files: {
      'dest/default_options.html': ['src/header.html', 'src/template.html']
    },
  },
});
```

#### Simple Configuration
In this example the task combines the files `header.html` and `template.html` to `simple_configuration.html`. In addition to that, all occurrences of `###title###`, `###content###` and `###footer###` are replaced by the defined values in the `replace` object.

```js
grunt.initConfig({
  'json-template-replace': {
    custom_options: {
      options: {
        replace: {
          'title': 'This is the title',
          'content': 'Lorem ipsum.',
          'footer': 'Copyright (c) 2016'
        }
      },
      files: {
        'dest/simple_configuration.html': ['src/header.html', 'src/template.html']
      }
    }
  },
});
```

#### Extended Configuration
In this extended example all occurrences of `###title###`, `###content###` and `###footer###` are replaced by the defined values in the `replace` object (like in the simple configuration example). Furthermore, not only simple strings are supported: it is possible to define JSON sub-objects containing code snippets or references to code snippets.

The code snippets or file references have to be defined in the `snippet` field. If the value is a filepath, the flag `isFile` must be `true`. The `items` field contains an array of JSON objects (only a simple key/value structure is supported now). The task iterates over the `items` array and replaces the placeholders in the associated code snippet. The snippets are copied and concatenated for each object in the `items` array. In this example the snippets are replacements for `###navigation###` and `###list###` in the end. 

The fields `isFile` (the default value here is `false`) and `items` are optional. Therefore, it is possible to include code snippets like an HTML header or footer even without replacements.

```js
grunt.initConfig({
  'json-template-replace': {
      custom_options: {
        options: {
          replace: {
            'title': 'This is the title',
            'navigation': {
              'snippet': 'src/include.html',
              'isFile': true,
              'items': [{'naviitem': 'Item 1'}, {'naviitem': 'Item 2'}]
            },
            'content': 'Lorem ipsum.',
            'list': {
              'snippet': '<li>###listitem###</li>',
              'isFile': false,
              'items': [{'listitem': 'Item 1'}, {'listitem': 'Item 2'}, {'listitem': 'Item 3'}]
            },
            'footer': 'Copyright (c) 2016'
          }
        },
        files: {
          'dest/extended_configuration.html': ['src/template.html']
        }
      }
    },
});
```

It is easier to understand the plugin with concrete examples. The following HTML code snippet is the content of the `template.html` file before all replacements:

```html
<html>
  <head>
    <title>###title###</title>
  </head>
  <body>
    <h1>###title###</h1>
    <ul class="navigation">
      ###navigation###
    </ul>
    <p>###content###</p>
    <ul>
      ###list###
    </ul>
    <p>###footer###</p>
  </body>
</html>
```

After the replacements the file `extended_configuration.html` looks like this:

```html
<html>
  <head>
    <title>This is the title</title>
  </head>
  <body>
    <h1>This is the title</h1>
    <ul class="navigation">
      <li>Item 1</li><li>Item 2</li>
    </ul>
    <p>Lorem ipsum.</p>
    <ul>
      <li>Item 1</li><li>Item 2</li><li>Item 3</li>
    </ul>
    <p>Copyright (c) 2016</p>
  </body>
</html>
```
