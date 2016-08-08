var router = require('koa-router')();
var config = require('../config');
var article = require('../models/article');
var game = require('../models/game');

router.get('/:articleId', async function (ctx, next) {
  var articleTask = article.getArticle({
    aid: ctx.params.articleId
  });
  var newsTask = article.getArticles({
    pageIndex: 1,
    pageSize: 5,
    category: 'news'
  });
  var hotsTask = game.getHotRecommends({
    pageIndex: 1,
    pageSize: 5
  });
  var data = await articleTask;
  var news = await newsTask;
  var hots = await hotsTask;
  if (!data) {
    return ctx.status = 404;
  }

  await ctx.render('news', {
    nav: 'index',
    article: data,
    news: news.data,
    hots: hots.data
  });
});

module.exports = router;