var router = require('koa-router')();
var config = require('../config');
var article = require('../models/article');

// 分类Map
const categoryMap = {
  all: '综合',
  news: '新闻',
  announcements: '公告'
};

router.get('/:category', async function (ctx, next) {
  var cateName = ctx.params.category;
  if (ctx.params.category == 'all') {
    cateName = 'news,announcements';
  }
  var articles = await article.getArticles({
    cateName: cateName,
    pageIndex: 1,
    pageSize: 20
  });
  if (!articles) {
    return ctx.status = 404;
  }
  var totalPages = Math.ceil(articles.total / articles.pagesize);
  await ctx.render('news_list', {
    category: {
      cname: categoryMap[ctx.params.category],
      ename: ctx.params.category
    },
    articles: articles.data,
    pageIndex: articles.pagenum,
    pageSize: articles.pagesize,
    totalPages: totalPages
  });
});

router.get('/:category/:pageIndex', async function (ctx, next) {
  var cateName = ctx.params.category;
  if (ctx.params.category == 'all') {
    cateName = 'news,announcements';
  }
  var articles = await article.getArticles({
    cateName: cateName,
    pageIndex: ctx.params.pageIndex,
    pageSize: 20
  });
  if (!articles) {
    return ctx.status = 404;
  }
  var totalPages = Math.ceil(articles.total / articles.pagesize);
  await ctx.render('news_list', {
    category: {
      cname: categoryMap[ctx.params.category],
      ename: ctx.params.category
    },
    articles: articles.data,
    pageIndex: articles.pagenum,
    pageSize: articles.pagesize,
    totalPages: totalPages
  });
});

module.exports = router;