var router = require('koa-router')();
var article = require('../models/article');

router.get('/:articleId', async function (ctx, next) {
  var data = await article.getArticle({
    aid: ctx.params.articleId
  });
  await ctx.render('info', {
    article: data
  });
});

module.exports = router;