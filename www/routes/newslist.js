var router = require('koa-router')();
var config = require('../config');
var article = require('../models/article');
var game = require('../models/game');

router.get('/', async function (ctx, next) {
  var articlesTask = article.getArticles({
    category: 'news',
    pageIndex: ctx.query.page || 1,
    pageSize: 20
  });
  var hotsTask = game.getHotRecommends({
    pageIndex: 1,
    pageSize: 5
  });
  var articles = await articlesTask;
  var hots = await hotsTask;
  var totalPages = Math.ceil(articles.total / articles.pagesize);
  await ctx.render('newslist', {
    nav: 'index',
    articles: articles.data,
    pageIndex: articles.pagenum,
    totalPages: totalPages,
    hots: hots.data
  });
});

module.exports = router;