var router = require('koa-router')();
var config = require('../config');
var article = require('../models/article');

// 获取文章列表
var getList = function (pageIndex, pageSize) {
  return article.getArticles({
    cateName: 'guides,features,introductions',
    pageIndex: pageIndex,
    pageSize: pageSize
  });
};

router.get('/', async function (ctx, next) {
  var articles = await getList(1, 20);
  var totalPages = Math.ceil(articles.total / articles.pagesize);
  await ctx.render('info_list', {
    articles: articles.data,
    pageIndex: articles.pagenum,
    pageSize: articles.pagesize,
    totalPages: totalPages
  });
});

router.get('/:pageIndex', async function (ctx, next) {
  var articles = await getList(ctx.params.pageIndex, 20);
  if (!articles) {
    return ctx.status = 404;
  }
  var totalPages = Math.ceil(articles.total / articles.pagesize);
  await ctx.render('info_list', {
    articles: articles.data,
    pageIndex: articles.pagenum,
    pageSize: articles.pagesize,
    totalPages: totalPages
  });
});

module.exports = router;