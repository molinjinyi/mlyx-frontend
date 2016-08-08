var router = require('koa-router')();
var config = require('../config');
var carousel = require('../models/carousel');
var article = require('../models/article');
var slot = require('../models/slot');
var link = require('../models/link');

var awaitData = async function (prom) {
  var result = await prom;
  return result.data;
}

router.get('/', async function (ctx, next) {
  var carouselsTask = carousel.getCarousels();
  var articlesTask = article.getArticles({
    cateName: 'news,announcements',
    pageIndex: 1,
    pageSize: 9
  });
  var newsTask = article.getArticles({
    cateName: 'news',
    pageIndex: 1,
    pageSize: 9
  });
  var announcementsTask = article.getArticles({
    cateName: 'announcements',
    pageIndex: 1,
    pageSize: 9
  });
  var guidesTask = article.getArticles({
    cateName: 'guides',
    pageIndex: 1,
    pageSize: 14
  });
  var featuresTask = article.getArticles({
    cateName: 'features',
    pageIndex: 1,
    pageSize: 14
  });
  var introductionsTask = article.getArticles({
    cateName: 'introductions',
    pageIndex: 1,
    pageSize: 14
  });
  var slotsTask = slot.getSlots();
  var linksTask = link.getLinks();

  var carousels = carouselsTask;
  var articles = await awaitData(articlesTask);
  var news = await awaitData(newsTask);
  var announcements = await awaitData(announcementsTask);
  var guides = await awaitData(guidesTask);
  var features = await awaitData(featuresTask);
  var introductions = await awaitData(introductionsTask);
  var slots = slotsTask;
  var links = linksTask;

  await ctx.render('index', {
    categories: [{
      ename: 'news',
      cname: '新闻'
    }, {
      ename: 'announcements',
      cname: '公告'
    }],
    carousels: carousels || [],
    // spread: {
    //   url: '/spread/2015/12/01.html',
    //   title: '古剑奇谭上线 再书奇谭玄幻之旅'
    // },
    articles: articles || [],
    news: news || [],
    announcements: announcements || [],
    features: [{
      title: '新手指南',
      image: config.assets + '/images/features/feature_1.jpg',
      childrens: guides || []
    }, {
      title: '特色系统',
      image: config.assets + '/images/features/feature_2.jpg',
      childrens: features || []
    }, {
      title: '系统介绍',
      image: config.assets + '/images/features/feature_3.jpg',
      childrens: introductions || []
    }],
    slots: slots || [],
    links: links || []
  });
});

module.exports = router;