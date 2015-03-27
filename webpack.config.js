var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['expose?app!./src/index.js'],
    output: {
        path: './dist',
        filename: 'index_bundle.js'
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
