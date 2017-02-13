var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index_bundle.js',
        libraryTarget: 'var',
        library: 'app'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css'}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Test client for rabbit-web-stomp',
            filename: 'index.html'
        })
    ],
    devServer: {
        contentBase: './dist'
    }
};
