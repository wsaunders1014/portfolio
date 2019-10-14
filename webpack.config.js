const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require( 'path' );
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    context: __dirname,
    entry: './src/js/main.js',
    output: {
        path: path.resolve( __dirname, './dist/' ),
        filename: 'js/main.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader','eslint-loader'],
            },
            {
              test: /\.html$/,
              use: [
                  {
                    loader: "html-loader",
                    options: { minimize: true }
                  }
              ]
            },
            {
              test: /\.scss$/i,
              use: ['style-loader',"css-loader",'sass-loader' ]
            },
            {
              test: /\.(jpg|png|gif|svg|mp3)$/,
              //include:path.join(__dirname,'/dist/img'),
              use: {
                loader: "file-loader",
                options: {
                  name: "[path][name].[hash].[ext]",
                }
              }
            }
        ]
    },
    devServer:{
      contentBase:"./src",
      watchContentBase:true,
      hot:true,
      liveReload:true
    },
    plugins:[
      new HtmlWebpackPlugin({
        template:"src/index.html",
        filename:"index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new CopyPlugin([
        {from:'src/img', to:'img'}
      ])
    ]
};
