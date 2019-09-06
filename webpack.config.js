const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
	mode:'development',
	entry:'./src/index.js',
	devtool:'inline-source-map',
	devServer:{
		contentBase: './dist',
		hot:true
	},
	plugins: [
		//new HtmlWebpackPlugin({}),
		new MiniCssExtractPlugin()
	],
	output:{
		filename:'main.js',
		path: path.resolve(__dirname,'dist')
	},
	module:{
		rules:[
		 {
		 	test:/\.css$/,
		 	use:[
		 		'style-loader',
		 		'css-loader'
		 	]
		 },
		 {
	 	 	test:/\.(png|svg|jpg|gif)$/,
		 	use: ['file-loader']
		 },
		 {
		 	test:/\.less$/,
		 	use:[
		 		module.exports.mode == 'development' ? MiniCssExtractPlugin.loader : 'style-loader',
		 		'css-loader',
		 		'less-loader'
		 	]
		 }
		]
	}
}