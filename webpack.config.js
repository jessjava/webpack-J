const path = require('path');

const entry = './src/es6/index.js';

module.exports = {
  mode: 'development',
  entry,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'foo.bundle.js'
  }
};
