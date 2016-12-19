module.exports = {
	entry: "./app/assets/scripts/App.js", 
	output: {
		path: "./app/temp/scripts", 
		filename: "App.js"
	}, 
	modules: {
		loaders: [
			{
				loader: 'babel', 
				query: {
					presets: ['es2015']
				}, 
				test: /\.js$/, 
				exclude: /node_modules/
			}
		]
	}
}