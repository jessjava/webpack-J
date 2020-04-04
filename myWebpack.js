const Complier = require('./lib/complier.js');
const config = require('./webpack.config.js');

const complier = new Complier(config);
complier.run();