const path = require('path');

module.exports = {
  mode: 'development',
  entry: './es6/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
};
