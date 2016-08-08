var router = require('koa-router')();
var config = require('../config');
var server = require('../models/server');
var article = require('../models/article');
var game = require('../models/game');

router.get('/', async function (ctx, next) {
  var recommendsTask = game.getRecommends({
    catnames: 'game'
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
    pageSize: 5
  });
  var gamesTask = game.getGames({
    state: 1,
    pageIndex: ctx.query.page || 1,
    pageSize: 9
  });

  var recommends = await recommendsTask;
  var serverPreviews = await serverPreviewsTask;
  var serverNewests = await serverNewestsTask;
  var news = await newsTask;
  var games = await gamesTask;

  var totalPages = Math.ceil(games.total / games.pagesize);
  await ctx.render('index', {
    recommends: recommends,
    serverPreviews: serverPreviews.data,
    serverNewests: serverNewests.data,
    news: news.data,
    games: games.data,
    totalPages: totalPages,
    pageIndex: games.pagenum
  });
});

module.exports = router;