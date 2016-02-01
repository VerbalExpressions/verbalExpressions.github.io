module.exports = function Gruntfile(grunt) {
  'use strict';
  module.require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc',
      },
      Gruntfile: [
        'Gruntfile.js',
      ],
      assets: [
        'assets/app.js',
      ],
    },
    uglify: {
      assets: {
        files: {
          'assets/app.min.js': 'assets/app.js',
        },
      },
    },
    watch: {
      Gruntfile: {
        files: [
          'Gruntfile.js',
        ],
        tasks: [
          'eslint:Gruntfile',
        ],
      },
      assets_app: {
        files: [
          'assets/app.js',
        ],
        tasks: [
          'eslint:assets',
          'uglify:assets',
        ],
      },
    },
  });
  grunt.registerTask('default', [
    'eslint:Gruntfile',
    'eslint:assets',
    'uglify:assets',
  ]);
};
