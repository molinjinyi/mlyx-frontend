const Koa = require('koa');
const Pug = require('koa-pug');
const app = new Koa();
const serve = require('koa-static');
const router = require('koa-router')();
const convert = require('koa-convert');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const debug = require('debug')('debug');
const moment = require('moment');
const nconf = require('nconf');
const config = require('./config');

// routes
var index = require('./routes/index');
var news = require('./routes/news');
var newsList = require('./routes/news_list');
var info = require('./routes/info');
var infoList = require('./routes/info_list');
var serverList = require('./routes/server_list');
var gift = require('./routes/gift');
var vip = require('./routes/vip');

// middlewares
app.use(serve('.'));
app.use(convert(bodyparser()));
app.use(convert(json()));
app.use(convert(logger()));

var env = nconf.get('NODE_ENV');

new Pug({
  app: app,
  basedir: __dirname + '/views/layouts',
  viewPath: __dirname + '/views',
  locals: {
    config: config,
    moment: moment
  },
  noCache: env === 'development' ? true : false
});

// 404
app.use(async (ctx, next) => {
  await next();
  if (ctx.response.status == 404) {
    await ctx.render('404');
    ctx.status = 404;
  }
});

// router
router.use('/', index.routes(), index.allowedMethods());
router.use('/news', news.routes(), news.allowedMethods());
router.use('/news_list', newsList.routes(), newsList.allowedMethods());
router.use('/info', info.routes(), info.allowedMethods());
router.use('/info_list', infoList.routes(), infoList.allowedMethods());
router.use('/server_list', serverList.routes(), serverList.allowedMethods());
router.use('/gift', gift.routes(), gift.allowedMethods());
router.use('/vip', vip.routes(), vip.allowedMethods());
app.use(router.routes(), router.allowedMethods());

// response
app.on('error', function (err, ctx) {
  debug(err);
  console.log(err);
});

module.exports = app;