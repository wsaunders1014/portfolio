const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require( 'path' );
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    context: __dirname,
    entry: './src/js/main.js',
    output: {
        path: path.resolve( __dirname, './dist/' ),
        filename: 'js/main.[contenthash].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
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
              test:/\.css$/i,
              use:[MiniCssExtractPlugin.loader,'css-loader']
            },
            {
              test: /\.(jpg|jpeg|png|gif|svg|webp|mp3)$/i,
              type: 'asset/resource',
              generator: {
                filename: 'img/[name].[contenthash][ext]',
              }
            }
        ]
    },
    devServer:{
      host:'localhost',
      port:8080,
      static: {
        directory: path.resolve(__dirname, 'src'),
        watch: true
      },
      watchFiles: ['src/**/*.html'],
      hot:true,
      liveReload:true
    },
    plugins:[
      new HtmlWebpackPlugin({
        template:"src/index.html",
        filename:"index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash].css",
        chunkFilename: "css/[id].css"
      }),
      new CopyPlugin({ patterns: [
        {from:'src/img', to:'img'},
      ] })
    ]
};
