var router = require('koa-router')();
var config = require('../config');
var article = require('../models/article');
var rightcomponents = require('../models/rightcomponents');

router.get('/:articleId', async function (ctx, next) {

  var carouselsTask = rightcomponents.getCarousels();

  var data = await article.getArticle({
    aid: ctx.params.articleId
  });

  var carouselList = await carouselsTask;

  var renderData = {
    article: data,
    carouselList: carouselList
  };
  await ctx.render('news', renderData);
});

module.exports = router;