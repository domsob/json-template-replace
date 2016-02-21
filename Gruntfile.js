/*
 * json-template-replace
 * https://github.com/domsob/json-template-replace
 *
 * Copyright (c) 2016 Dominik Sobania
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    'json-template-replace': {
      default_options: {
        files: {
          'tmp/default_options.html': ['test/fixtures/header_comment.html', 'test/fixtures/template.html']
        }
      },
      custom_options: {
        options: {
          replace: {
            'title': 'This is the title',
            'navigation': {
              'snippet': 'test/fixtures/include_template.html',
              'isFile': true,
              'items': [{'naviitem': 'Item 1'}, {'naviitem': 'Item 2'}, {'naviitem': 'Item 3'}]
            },
            'content': 'Lorem ipsum dolor sit amet.',
            'list': {
              'snippet': '<li>###listitem###</li>',
              'isFile': false,
              'items': [{'listitem': 'Item 1'}, {'listitem': 'Item 2'}, {'listitem': 'Item 3'}, {'listitem': 'Item 4'}]
            },
            'footer': 'Copyright (c)',
            'year': 2016
          }
        },
        files: {
          'tmp/custom_options.html': ['test/fixtures/header_comment.html', 'test/fixtures/template.html']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'json-template-replace', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
