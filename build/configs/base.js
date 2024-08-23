const { merge } = require('webpack-merge');

const ESLintPlugin = require('eslint-webpack-plugin');
const ESLintFormatter = require('eslint-formatter-friendly');
const { VueLoaderPlugin } = require('vue-loader');
const CopyPlugin = require('copy-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');

const utils = require('../utils');

const cssConfig = require('./css');

module.exports = (env, argv, config) => {
    let sourceMap;
    if (config.mode === 'development') {
        sourceMap = env.WEBPACK_SERVE ? 'eval-source-map' : 'source-map';
    } else if (argv.srcmap) {
        sourceMap = 'source-map';
    }

    const baseConfig = merge(config, {
        context: process.cwd(),

        entry: {
            'emojis': './src/plugin.js',
            'emojis-prelim': './src/prelim.js',
        },

        devtool: sourceMap,

        output: {
            path: utils.pathResolve('dist'),
            publicPath: 'auto',
            filename: 'plugin-[name].js',
        },

        resolve: {
            alias: {
                '@': utils.pathResolve('src'),
            },
            extensions: ['.js', '.jsx', '.vue', '.json'],
        },

        externals: {
            vue: 'kiwi.Vue',
        },

        performance: {
            maxEntrypointSize: 1 * utils.MiB, // 1MiB
            maxAssetSize: 1 * utils.MiB, // 1MiB
        },

        plugins: [
            new ESLintPlugin({
                emitError: true,
                emitWarning: true,
                extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
                formatter: ESLintFormatter,
            }),
            new VueLoaderPlugin(),
            new CopyPlugin({
                patterns: [
                    {
                        from: utils.pathResolve('src/res/animated_emojis'),
                        to: utils.pathResolve('dist/plugin-emojis/animated'),
                        toType: 'dir',
                        filter: async (file) => /\.gif$/.test(file),
                        globOptions: {
                            ignore: ['.*'],
                        },
                    },
                ],
            }),
            new CaseSensitivePathsPlugin(),
            new FriendlyErrorsWebpackPlugin(),
        ],

        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: [
                        {
                            loader: 'vue-loader',
                            options: {
                                transformAssetUrls: {
                                    // Defaults
                                    video: ['src', 'poster'],
                                    source: 'src',
                                    img: 'src',
                                    image: ['xlink:href', 'href'],
                                    use: ['xlink:href', 'href'],

                                    // Object can be used for svg files
                                    object: 'data',
                                },
                                compilerOptions: {
                                    comments: false,
                                },
                            },
                        },
                    ],
                },

                {
                    test: /\.js$/,
                    exclude: (file) => /node_modules/.test(file),
                    use: ['babel-loader'],
                },
            ],
        },
    });

    return cssConfig(env, argv, baseConfig);
};
