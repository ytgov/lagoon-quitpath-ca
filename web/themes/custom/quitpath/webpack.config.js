const path = require('path');

module.exports = {
    entry: {
        main: './src/js/main.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'js/dist'),
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    resolve: {
        extensions: ['.js']
    }
};