const webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
	},
	//devtool: 'source-map',
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			}
		]
	},
	devServer: {
		contentBase: './',
		port: 8080,
		noInfo: true,
		hot: false,
		inline: false,
		proxy: {
			'/': {
				bypass: function (req, res, proxyOptions) {
					// Check if it's file serving or internal routing
					if (req.path.includes('.')) return '/public' + req.path;
					return '/public/index.html';
				}
			}
		}
	},
	plugins: [
		//new webpack.HotModuleReplacementPlugin()
	]
};
