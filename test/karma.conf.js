var reporters = [
    'mocha',
    'coverage'
];

var coverageType = 'html';

if (process.env.TRAVIS) {
    coverageType = 'lcov';
    reporters.push('coveralls');
}

module.exports = function (config) {
    config.set({
        browsers: [ 'PhantomJS' ],
        plugins: [
            'karma-mocha',
            'karma-coverage',
            'karma-coveralls',
            'karma-phantomjs-launcher',
            'karma-mocha-reporter'
        ],
        frameworks: [ 'mocha' ],
        reporters: reporters,
        client: {
            mocha: {
                ui: 'bdd'
            }
        },
        basePath: '../',
        files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/sinon/pkg/sinon.js',
            'node_modules/unexpected/unexpected.js',
            'node_modules/unexpected-sinon/lib/unexpected-sinon.js',
            'src/*.js',
            'src/**/*.js',
            'test/bootstrap.js',
            'test/**/*.spec.js'
        ],
        preprocessors: {
            'src/**/*.js': [ 'coverage' ]
        },
        coverageReporter: {
            dir: 'coverage/',
            type: coverageType
        },
        singleRun: true
    });
};
