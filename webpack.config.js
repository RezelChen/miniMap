module.exports = {
  devtool: 'source-map',
  entry: [
    "babel-polyfill",
    "./test.js"
  ],
  output: {
    path: __dirname + '/output/',
    publicPath: "/output/",
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
      }
    ]
  }
};
