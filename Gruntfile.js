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
    htmlSnapshot: {
      index: {
        options: {
          bodyAttr: 'data-prerendered',
          fileNamePrefix: '',
          msWaitForPages: 5000,
          urls: [
            'assets/index.vulcanized.html',
          ],
        },
      },
    },
    postcss: {
      options: {
        processors: [
          module.require('cssnano')({
            mergeRules: false,
          }),
        ],
      },
      assets: {
        files: {
          'assets/style.min.css': 'assets/style.css',
        },
      },
    },
    rename: {
      index: {
        files: {
          'index.html': 'assets_index.vulcanized.html.html',
        },
      },
    },
    uglify: {
      assets: {
        files: {
          'assets/app.min.js': 'assets/app.js',
        },
      },
    },
    vulcanize: {
      options: {
        inlineScripts: true,
        inlineCss: true,
        stripComments: true,
      },
      index: {
        files: {
          'assets/index.vulcanized.html': 'assets/index.html',
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
      assets_postcss: {
        files: [
          'assets/style.css',
        ],
        tasks: [
          'postcss:assets',
        ],
      },
      vulcanize_index: {
        files: [
          'assets/index.html',
          'assets/app.min.js',
          'assets/style.min.css',
        ],
        tasks: [
          'vulcanize:index',
          'htmlSnapshot:index',
          'rename:index',
        ],
      },
    },
  });
  grunt.registerTask('default', [
    'eslint:Gruntfile',
    'eslint:assets',
    'uglify:assets',
    'postcss:assets',
    'vulcanize:index',
    'htmlSnapshot:index',
    'rename:index',
  ]);
};
