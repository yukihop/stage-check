module.exports = {
	entry: './src/index.jsx',
	output: {
		path: __dirname + '/built',
		filename: "main.js"
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'react']
				}
			},
			{
				test: /\.less$/,
				loader: 'style!css!less'
			}
		]
	}
};
