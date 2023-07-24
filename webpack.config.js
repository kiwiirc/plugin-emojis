const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');
const makeSourceMap = process.argv.indexOf('--srcmap') > -1;

module.exports = {
    mode: 'production',
    entry: {
        'emojis': './src/plugin.js',
        'emojis-prelim': './src/prelim.js'
    },
    output: {
        filename: 'plugin-[name].js',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                use: [{loader: 'babel-loader'}],
                include: [
                    path.join(__dirname, 'src'),
                ]
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    optimization: {
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    },
    devtool: makeSourceMap ? 'source-map' : undefined,
    devServer: {
        static: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }
};
