const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path');

module.exports = {
    mode:"development",
    devtool: 'eval-source-map',
    output:{
        filename:"bundle.js"
    },
    module: {
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(svg|woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options:{
                            outputPath: 'fonts',
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpeg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options:{
                            outputPath: 'img',
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new HtmlWebpackPlugin({
            template:'index.html'
        })
    ],
    devServer: {
        // contentBase: __dirname
    }
}