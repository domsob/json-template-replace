'use strict';

var grunt = require('grunt');

exports['json-template-replace'] = {
  setUp: function(done) {
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options.html');
    var expected = grunt.file.read('test/expected/default_options.html');
    test.equal(actual, expected, 'Tests a simple concatenation of two files.');

    test.done();
  },
  custom_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/custom_options.html');
    var expected = grunt.file.read('test/expected/custom_options.html');
    test.equal(actual, expected, 'Concatenation of two files and replacement of defined placeholders.');

    test.done();
  },
};
