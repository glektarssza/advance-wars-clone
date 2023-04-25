/// <reference types="node" />
import {Config, ConfigOptions} from 'karma';
import {executablePath} from 'puppeteer';
import configs from './webpack.config';

const puppeteerExePath = executablePath();
if (
    puppeteerExePath !== undefined &&
    puppeteerExePath !== null &&
    puppeteerExePath !== ''
) {
    process.env['CHROME_BIN'] = puppeteerExePath;
}
const webpackConfig = configs.find((config) => config.name === 'tests');

if (webpackConfig === undefined) {
    throw new Error('Unit test Webpack config not found');
}

const configure = (config: Config) => {
    config.set({
        basePath: __dirname,
        frameworks: ['mocha', 'webpack'],
        reporters: ['coverage', 'spec'],
        files: [
            './src/ts/**/*.ts',
            {
                pattern: './tests/**/*.spec.ts',
                watched: false
            }
        ],
        preprocessors: {
            './src/ts/**/*.ts': ['webpack', 'sourcemap', 'coverage'],
            './tests/**/*.spec.ts': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        coverage: {
            reporter: 'html',
            dir: 'coverage'
        }
    } as ConfigOptions);
};

export default configure;
