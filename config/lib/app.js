'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongooseService = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk'),
  seed = require('./mongo-seed');

// console.log(`--jason 0b-- config: ${JSON.stringify(config)}`);

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
    seed.start();
  }
}

module.exports.init = function init(callback) {
    console.log('--jason 02');
    mongooseService.connect(function (db) {
      console.log(`--jason 03, db: ${db}`);
      // Initialize Models
      mongooseService.loadModels(seedDB);

      // Initialize express
      var app = express.init(db);
      if (callback) callback(app, db, config);
  });
};

module.exports.start = function start(callback) {
  var _this = this;
  console.log('--jason 01');

  _this.init(function (app, db, config) {
    console.log('--jason 04');
    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {
      // Create server URL
      var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green(`Environment:     ${process.env.NODE_ENV}`));
      console.log(chalk.green(`Server:          ${server}`));
      console.log(chalk.green(`Database:        ${config.db.uri}`));
      console.log(chalk.green(`App version:     ${config.meanjs.version}`));
      if (config.meanjs['meanjs-version'])
        console.log(chalk.green(`MEAN.JS version: ${config.meanjs['meanjs-version']}`));
      console.log('--');

      if (callback) callback(app, db, config);
    });

  });

};
