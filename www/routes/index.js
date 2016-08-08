var router = require('koa-router')();
var carousel = require('../models/carousel');
var game = require('../models/game');
var server = require('../models/server');
var article = require('../models/article');

router.get('/', async function (ctx, next) {
  var carouselsTask = carousel.getCarousels({
    catnames: 'home'
  });
  var recommendsTask = game.getRecommends({
    catnames: 'home'
  });
  var qualitiesTask = game.getRecommends({
    catnames: 'homequality'
  });
  var serverPreviewsTask = server.getPreviews({
    pageIndex: 1,
    pageSize: 20
  });
  var serverNewestsTask = server.getNewests({
    pageIndex: 1,
    pageSize: 30
  });
  var newsTask = article.getArticles({
    pageIndex: 1,
    pageSize: 5,
    category: 'news'
  });

  var carousels = await carouselsTask;
  var recommends = await recommendsTask;
  var qualities = await qualitiesTask;
  var serverPreviews = await serverPreviewsTask;
  var serverNewests = await serverNewestsTask;
  var news = await newsTask;

  await ctx.render('index', {
    nav: 'index',
    carousels: carousels,
    recommends: recommends,
    qualities: qualities,
    serverPreviews: serverPreviews.data,
    serverNewests: serverNewests.data,
    news: news.data
  });
});

module.exports = router;
