const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rules = require('./webpack.rules.ui');
const base = require('./webpack.config.base');

const config = {
    entry: './src/views/index.tsx',
    target: 'web',

    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.min.js',
    },

    module: {
        rules,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/views/index.html',
        }),
        new webpack.DefinePlugin({
            'process.env.DESKTOP_PATH': 'C:\\Users\\garbe\\Desktop\\',
        }),
    ],
};

module.exports = merge(base, config);
