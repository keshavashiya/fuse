const webpack = require('webpack');
const { merge } = require('webpack-merge');
// const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'production',
	// devtool: "source-map",
	node: {
		module: 'empty',
		dgram: 'empty',
		dns: 'mock',
		fs: 'empty',
		http2: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	},
	stats: {
		colors: true,
		hash: true,
		timings: true,
		assets: true,
		chunks: true,
		chunkModules: true,
		modules: true,
		children: true
	},
	optimization: {
		minimize: true,
		minimizer: [
			// new TerserPlugin({
			//   test: /\.js(\?.*)?$/i,
			// }),
			new TerserPlugin({
				sourceMap: false
			}),
			// new UglifyJSPlugin({
			//   sourceMap: true,
			//   uglifyOptions: {
			//     compress: {
			//       inline: false,
			//     },
			//   },
			// }),
			new OptimizeCSSAssetsPlugin({})
		],
		runtimeChunk: false,
		splitChunks: {
			cacheGroups: {
				default: false,
				vendors: false,
				chunks: 'all',
				minSize: '0',
				maxInitialRequests: '20',
				maxAsyncRequests: '20',
				// default: false,
				// vendors: false,
				// chunks: "all",
				// maxInitialRequests: "6",
				// minSize: "0",
				// minSize: false,
				// maxInitialRequests: false,
				// styles: {
				//   name: "styles",
				//   test: /\.css$/,
				//   chunks: "all",
				//   enforce: true,
				// },
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(
							/[\\/]node_modules[\\/](?:(@[\w-]*?[\\/].*?|.*?)([\\/]|$))/
						)[1];

						// npm package names are URL-safe, but some servers don't like @ symbols
						return `npm.${packageName.replace('@', '')}`;
					},
					priority: 20
				},
				react: {
					test: /[\\/]node_modules[\\/](@react|react)[\\/]/,
					name: 'npm.react',
					enforce: true,
					chunks: 'all',
					priority: 30
				},
				materialui: {
					test: /[\\/]node_modules[\\/](@material-ui|material-ui)[\\/]/,
					name: 'npm.materialui',
					enforce: true,
					chunks: 'all',
					priority: 31
				},
				xlsx: {
					test: /[\\/]node_modules[\\/](@xlsx|xlsx)[\\/]/,
					name: 'npm.xlsx',
					enforce: true,
					chunks: 'all',
					priority: 32
				},
				reactpdf: {
					test: /[\\/]node_modules[\\/](@react-pdf|react-pdf)[\\/]/,
					name: 'npm.reactpdf',
					enforce: true,
					chunks: 'all',
					priority: 33
				},
				iconvlite: {
					test: /[\\/]node_modules[\\/](@iconv-lite|iconv-lite)[\\/]/,
					name: 'npm.iconvlite',
					enforce: true,
					chunks: 'all',
					priority: 34
				},
				// npmbundle: {
				//   test: /[\\/]node_modules[\\/](@material-ui-phone-number|material-ui-phone-number|@react-trello|react-trello|@uppy|uppy|@material-table|material-table)[\\/]/,
				//   name: "npm.npmbundle",
				//   enforce: true,
				//   chunks: "all",
				//   priority: 33,
				// },
				// materialtable: {
				//   test: /[\\/]node_modules[\\/](@material-table|material-table)[\\/]/,
				//   name: "npm.materialtable",
				//   enforce: true,
				//   chunks: "all",
				//   priority: 30,
				// },
				// material: {
				//   test: /[\\/]node_modules[\\/]((@material-ui[\\/].*?|.*?)([\\/]|$))/,
				//   name: "vendor.material",
				//   enforce: true,
				//   chunks: "all",
				//   priority: 30,
				// },
				// react: {
				//   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
				//   name: "npm.react",
				//   chunks: "all",
				//   priority: 40,
				// },
				// common chunk
				common: {
					name: 'common',
					minChunks: 2,
					chunks: 'async',
					priority: 10,
					reuseExistingChunk: true,
					enforce: true
				}
				// vendors: {
				//   test: /[\\/]node_modules[\\/]/,
				//   name: "vendors",
				//   chunks: "all",
				//   priority: 10,
				//   // minChunks: 2
				// },
				// react: {
				//   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
				//   name: "react",
				//   chunks: "all",
				//   priority: 11,
				// },
				// mui: {
				//   test: /[\\/]node_modules[\\/](material-ui)[\\/]/,
				//   name: "mui",
				//   chunks: "all",
				//   priority: 12,
				//   // enforce: true,
				//   // reuseExistingChunk: true,
				// },
				// muiui: {
				//   test: /[\\/]node_modules[\\/](@material-ui)[\\/]/,
				//   name: "muiui",
				//   chunks: "all",
				//   minChunks: 2,
				//   priority: 13,
				//   // enforce: true,
				//   // reuseExistingChunk: true
				// },
				// common chunk
				// common: {
				//     name: 'common',
				//     minChunks: 2,
				//     chunks: 'async',
				//     priority: 10,
				//     reuseExistingChunk: true,
				//     enforce: true
				// }
			}
		}
	},
	plugins: [
		new CompressionPlugin()
		// new webpack.DefinePlugin({
		//   "process.env": {
		//     NODE_ENV: JSON.stringify(process.env.NODE_ENV),
		//   },
		// }),
	]
	// optimization: {
	//   // minimizer: [new UglifyJsPlugin({ sourceMap: true })],
	//   // minimize: true,
	//   minimizer: [new TerserPlugin({ sourceMap: true })],
	// },
});
