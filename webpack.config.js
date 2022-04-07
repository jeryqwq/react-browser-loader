const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

const mode = "development"
module.exports = {
  entry: './src/dev.ts',
  mode,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      'path': require.resolve('path-browserify'), // only the posix part
    } 
  },
  output: {
    filename: 'react-browser-loader.js',
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode), // see also: https://webpack.js.org/configuration/optimization/#optimizationnodeenv
				'process.env.NODE_DEBUG': 'undefined',
				'process.env.DEBUG': 'undefined',
				'process.env.BABEL_ENV': JSON.stringify(mode),
				'process.env.BABEL_TYPES_8_BREAKING': false,
				// further optimizations (ease dead code elimination)
				'process.stdin': 'null',
				'process.stdout': 'null',
				'process.stderr': 'null',
				'process.browser': 'true',
				'process.env.TERM': 'undefined',
				// config
				'process.env.GEN_SOURCEMAP': JSON.stringify(false),
				'process.env.VERSION': JSON.stringify(pkg.version),
  }),
	new webpack.ProvidePlugin({
    'Buffer': ['buffer', 'Buffer'],
    'process': 'process',
  }),
],
  devServer: {
    static: {
      directory: path.join(__dirname, '/'),
    },
    compress: true,
    port: 7777,
  },
};
