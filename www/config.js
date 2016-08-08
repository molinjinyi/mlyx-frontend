const nconf = require('nconf');
const logger = require('./middleware/loggerhelper');

nconf.env().argv();
nconf.file(__dirname + '/config.json');

var env = nconf.get('NODE_ENV');
var config = nconf.get('dev');

logger.debug(env);
if (env == 'production') {
  logger.debug('pro');
  config = nconf.get('pro');
} else if (env == 'test') {
  logger.debug('test');
  config = nconf.get('test');
}

module.exports = config;