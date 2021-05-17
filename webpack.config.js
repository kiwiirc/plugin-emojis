const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const makeSourceMap = process.argv.indexOf('--srcmap') > -1;

module.exports = {
    mode: 'production',
    entry: './src/plugin.js',
    output: {
        filename: 'plugin-emojis.js',
    },
    performance: {
        hints: false
    },
    optimization: {
        minimize: false,
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
    devtool: makeSourceMap ? 'source-map' : '',
    devServer: {
        filename: 'plugin-emojis.js',
        contentBase: path.join(__dirname, "dist"),
        port: 9000
    }
};