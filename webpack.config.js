const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require( 'path' );
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    context: __dirname,
    entry: './src/js/main.js',
    output: {
        path: path.resolve( __dirname, './dist/' ),
        filename: 'js/main.[chunkhash].js',
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
              exclude: /nick/,
              use: [
                  {
                    loader: "html-loader",
                    options: { minimize: true }
                  }
              ]
            },
            {
              test: /\.scss$/i,
              use: [MiniCssExtractPlugin.loader,"css-loader",'sass-loader' ]
            },
            {
              test:/\.css/,
              use:[MiniCssExtractPlugin.loader,'css-loader']
            },
            {
              test: /\.(jpg|png|gif|svg|mp3|css)$/,
              //include:path.join(__dirname,'/dist/img'),
              use: {
                loader: "file-loader",
                options: {
                  name: "img/[name].[contenthash].[ext]",
                }
              }
            }
        ]
    },
    devServer:{
      host:'0.0.0.0',
      port:8080,
      inline:true,
      useLocalIp:true,
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
        filename: "css/[name].[chunkhash].css",
        chunkFilename: "css/[id].css"
      }),
      new CopyPlugin([
        {from:'src/img', to:'img'},
      ])
    ]
};
