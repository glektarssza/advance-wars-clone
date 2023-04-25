/// <reference types="node" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./pug-plugin.d.ts" />
/// <reference types="webpack-dev-server" />
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import PugPlugin from 'pug-plugin';
import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';

/**
 * The common configuration elements.
 */
const common: Configuration = {
    context: __dirname,
    entry: {
        index: './src/index.pug'
    },
    output: {
        clean: true
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(tsx|ts|jsx|js|scss|sass|less|css)$/,
                exclude: /node_modules/,
                use: ['source-map-loader']
            },
            {
                enforce: 'pre',
                test: /^src(\\|\/).*\.(tsx|ts)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: path.resolve(
                                __dirname,
                                './src/ts/tsconfig.json'
                            )
                        }
                    }
                ]
            },
            {
                enforce: 'pre',
                test: /^tests(\\|\/).*\.(tsx|ts)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: path.resolve(
                                __dirname,
                                './tests/tsconfig.json'
                            )
                        }
                    }
                ]
            },
            {
                test: /\.(scss|sass)$/,
                exclude: /node_modules/,
                use: ['css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(css)$/,
                exclude: /node_modules/,
                use: ['css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jpg|jpeg|bmp|gif)$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name].[contenthash].[ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[contenthash].[ext]'
                }
            },
            {
                test: /\.(pug|jade)$/,
                exclude: /node_modules/,
                use: [PugPlugin.loader]
            }
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            files: ['./src/ts/']
        })
    ]
};

/**
 * The development configuration.
 */
const dev: Configuration = webpackMerge(common, {
    name: 'dev',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 8080,
        hot: false,
        liveReload: false
    },
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: 'js/app.[contenthash].js'
    },
    module: {
        rules: []
    },
    plugins: [
        new PugPlugin({
            pretty: true,
            js: {
                filename: 'js/app.[contenthash].min.js'
            },
            css: {
                filename: 'css/app.[contenthash].min.css'
            }
        }),
        new ForkTSCheckerWebpackPlugin({
            async: true,
            devServer: false,
            typescript: {
                configFile: path.resolve(__dirname, './src/ts/tsconfig.json')
            }
        })
    ]
});

/**
 * The production configuration.
 */
const prod: Configuration = webpackMerge(common, {
    name: 'prod',
    mode: 'production',
    devtool: 'hidden-source-map',
    output: {
        path: path.resolve(__dirname, './dist/')
    },
    module: {
        rules: []
    },
    plugins: [
        new PugPlugin({
            pretty: false,
            js: {
                filename: 'js/app.[contenthash].min.js'
            },
            css: {
                filename: 'css/app.[contenthash].min.css'
            }
        }),
        new ForkTSCheckerWebpackPlugin({
            async: true,
            devServer: false,
            typescript: {
                configFile: path.resolve(__dirname, './src/ts/tsconfig.json')
            }
        })
    ]
});

export default [dev, prod];
