const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai', 'webpack'],
        files: [
            'test/test-helper.js',
            'test/spec/**/*.js'
        ],
        preprocessors: {
            'test/test-helper.js': ['webpack'],
            'test/spec/**/*.js': ['webpack']
        },
        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                                plugins: ['istanbul']
                            }
                        }
                    },
                    {
                        test: /\.css$/i,
                        use: ['style-loader', 'css-loader'],
                    },
                    {
                        test: /\.svg$/,
                        use: 'raw-loader'
                    }
                ]
            },
            resolve: {
                alias: {
                    // Alias if needed
                }
            },
            devtool: 'inline-source-map'
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            reporters: [
                { type: 'lcovonly', subdir: '.' },
                { type: 'text-summary' }
            ]
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        singleRun: true,
        concurrency: Infinity
    });
};
