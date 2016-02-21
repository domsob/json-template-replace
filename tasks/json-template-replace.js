/*
 * json-template-replace
 * https://github.com/domsob/json-template-replace
 *
 * Copyright (c) 2016 Dominik Sobania
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  function replaceAllSubstrings(needle, replacement, haystack) {
    var index = 0;
    do {
      haystack = haystack.replace(needle, replacement);
    } while((index = haystack.indexOf(needle, index + 1)) > -1);
    return haystack;
  }

  grunt.registerMultiTask('json-template-replace', 'This plugin allows you to replace placeholders defined in a JSON object. So you can define a template and integrate e.g. external services or just local JSON data.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      separator: '',
      prefix: '###',
      suffix: '###',
      replace: {}
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Replace the placeholders defined in the JSON object
      for (var key in options.replace) {
        var value = options.replace[key];
        if (options.replace.hasOwnProperty(key)) {
          if(value !== null && typeof(value) === 'object') {
            var snippetAddition = '';
            var snippet = '';
            var isFile = false;
            var items = [];
            if('isFile' in value) {
              if(value.isFile !== null && typeof(value.isFile) === 'boolean') {
                isFile = value.isFile;
              } else {
                grunt.fail.fatal('The value for "isFile" must be boolean.');
              }
            }
            if('snippet' in value) {
              if(isFile) {
                if (!grunt.file.exists(value.snippet)) {
                  grunt.fail.fatal('Defined file "' + value.snippet + '" not found.');
                } else {
                  snippet = grunt.file.read(value.snippet).trim();
                }
              } else {
                snippet = value.snippet;
              }
            } else {
              grunt.fail.fatal('The used JSON object is not correct.');
            }
            if('items' in value) {
              if(value.items !== null && Array.isArray(value.items)) {
                items = value.items;
              } else {
                grunt.fail.fatal('The value for "items" must be an array.');
              }
            }
            for(var j = 0; j < items.length; j++) { //Iterate through items
              if(items[j] !== null && typeof(items[j]) === 'object') {
                snippetAddition = snippetAddition + snippet; //Every item represents a snippet
                for (var innerKey in items[j]) { //Iterate through JSON object inside items
                  if(innerKey !== null && typeof(innerKey) !== 'object') {
                    snippetAddition = replaceAllSubstrings(
                      options.prefix + innerKey + options.suffix,
                      items[j][innerKey],
                      snippetAddition
                    );
                  } else {
                    grunt.fail.fatal('Incompatible type in an object inside the "items" array.');
                  }
                }
              } else {
                grunt.fail.fatal('Incompatible type in "items" array.');
              }
            }
            if(items.length < 1) {
              snippetAddition = snippet;
            }
            src = replaceAllSubstrings(
              options.prefix + key + options.suffix,
              snippetAddition,
              src
            );
          } else {
            src = replaceAllSubstrings(
              options.prefix + key + options.suffix,
              options.replace[key],
              src
            );
          }
        }
      }

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
