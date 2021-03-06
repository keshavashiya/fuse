const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const TerserPlugin = require("terser-webpack-plugin");
// const CompressionPlugin = require("compression-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

/* dotenv */
const dotenv = require('dotenv');
const fs = require('fs');

const currentPath = path.join(__dirname, '..');
// Create the fallback path (the development .env)
const basePath = currentPath + '/.env';
const envPath = basePath + '.' + process.env.NODE_ENV;
// Check if the file exists, otherwise fall back to the production .env
const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// Set the path parameter in the dotenv config
const fileEnv = dotenv.config({ path: finalPath }).parsed;

// call dotenv and it will return an Object with a parsed key
// reduce it to a nice object, the same as before (but with the variables from the file)
const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
	prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
	return prev;
}, {});

const htmlWebpackPlugin = new HtmlWebPackPlugin({
	template: './public/index.html',
	filename: './index.html',
	title: 'SleepGuard'
});

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, '../dist'),
		// filename:'[name].[hash].js'
		filename: '[name].[hash].js',
		chunkFilename: '[name].[chunkhash].js'
		// publicPath: './',
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'html-loader',
						options: { minimize: true }
					}
				]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'web')],
				use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.s?[ac]ss$/,
				use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader' // creates style nodes from JS strings
					},
					{
						loader: 'css-loader' // translates CSS into CommonJS
					},
					{
						loader: 'less-loader' // compiles Less to CSS
						// options: {
						//   modifyVars: {
						//     "primary-color": "#FF0000",
						//     "link-color": "#1DA57A",
						//     "border-radius-base": "2px",
						//     // or
						//     hack: `true; @import "your-less-file-path.less";`, // Override with less file
						//   },
						//   javascriptEnabled: true,
						// },
					}
				]
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader'
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				//loader: "file-loader?name=/assets/images/[contenthash].[ext]",
				loader: 'file-loader',
				options: {
					name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
				}
				// options: {
				//   name(file) {
				//     if (devMode) {
				//       return '[path][name].[ext]';
				//     }
				//     return '[contenthash].[ext]';
				//   },
				// },
				// options: {
				//   name: '/assets/images/[name].[ext]',
				// },
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/'
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx']
		// alias: {
		//   src: path.resolve(__dirname, "src/"),
		//   web: path.resolve(__dirname, "web/"),
		//   view: path.resolve(__dirname, "view/"),
		// },
	},
	plugins: [
		new CleanWebpackPlugin(),
		htmlWebpackPlugin,
		// new BundleAnalyzerPlugin({
		//   // Port that will be used by in `server` mode to start HTTP server.
		//   analyzerPort: 4000,
		// }),
		new MiniCssExtractPlugin({
			filename: devMode ? '[name].css' : '[name].[hash].css',
			chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
		}),
		// new CompressionPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: 'public/firebase-messaging-sw.js',
					to: path.join(__dirname, '../dist')
				},
				{
					from: 'public/manifest.json',
					to: path.join(__dirname, '../dist')
				},
				{ from: 'public', to: 'public' }
			],
			options: {
				concurrency: 100
			}
		}),
		// new webpack.DefinePlugin({
		//   "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		//   "process.env.API_BASE": JSON.stringify(process.env.API_BASE),
		// }),
		// new webpack.EnvironmentPlugin([
		//   "NODE_ENV",
		//   "API_BASE",
		//   "UPLOAD_API_BASE",
		//   "PUSH_SERVER_API_BASE",
		//   "XHR_UPLOAD_SERVER_API_BASE",
		//   "DRIVE_SERVER_API_BASE",
		// ]),
		new webpack.DefinePlugin(
			devMode
				? {
						'process.env': {
							NODE_ENV: JSON.stringify('development'),
							API_BASE: JSON.stringify(process.env.API_BASE),
							// UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
							// PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
							XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(process.env.XHR_UPLOAD_SERVER_API_BASE)
							// DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
						}
				  }
				: envKeys
		)
		// new webpack.DefinePlugin({
		//   "process.env": {
		//     NODE_ENV: JSON.stringify(envKeys.NODE_ENV),
		//     API_BASE: JSON.stringify(envKeys.API_BASE),
		//   },
		// }),

		// new webpack.DefinePlugin({
		//   "process.env": {
		//     NODE_ENV: JSON.stringify(process.env.NODE_ENV),
		//   },
		// }),
	],
	// optimization: {
	//   // minimizer: [new UglifyJsPlugin({ sourceMap: true })],
	//   // minimize: true,
	//   minimizer: [new TerserPlugin({ sourceMap: true })],
	// },
	devServer: {
		historyApiFallback: true
	}
};
