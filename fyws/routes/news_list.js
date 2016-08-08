var router = require('koa-router')();
var config = require('../config');
var article = require('../models/article');
var rightcomponents = require('../models/rightcomponents');

// 分类Map
const categoryMap = {
  news: '最新资讯',
  announcements: '公告',
  events: '活动',
  newbie: '新手引导',
  characteristics: '特殊玩法',
  seniorplayers: '高级玩家',
  playersarea: '玩家天地'
};

async function getArticles(ctx, next, cateName) {
  var data = {
    cateName: cateName,
    pageIndex: 1,
    pageSize: 20
  };
  var isNews = false;
  switch(cateName){
    case 'news':
      data.cateName = 'events,announcements';
      isNews = true;
      break;
    case 'announcements':
    case 'events':
      isNews = true;
      break;
    case 'newbie':
      data.cateName = 'newbie_guide';
      break;
    case 'characteristics':
      data.cateName = 'characteristics_play';
      break;
    case 'seniorplayers':
      data.cateName = 'senior_players';
      break;
    case 'playersarea':
      data.cateName = 'forum_activities,player_guide';
      break;
    default:
      isNews = false;
      break;
  }

  var carouselsTask = rightcomponents.getCarousels();

  var articles = await article.getArticles(data);
  if (!articles) {
    return ctx.status = 404;
  }
  var carouselList = await carouselsTask;
  var totalPages = Math.ceil(articles.total / articles.pagesize);
  var renderParam = {
    category: {
      cname: categoryMap[cateName],
      ename: cateName
    },
    articles: articles.data,
    pageIndex: articles.pagenum,
    pageSize: articles.pagesize,
    totalPages: totalPages,
    isNews : isNews,
    carouselList: carouselList
  };
  await ctx.render('news_list', renderParam);
}

router.get('/', async function (ctx, next) {
  var cateName = 'news';
  await getArticles(ctx, next, cateName);
});

router.get('/:category', async function (ctx, next) {
  var cateName = ctx.params.category;
  await getArticles(ctx, next, cateName);
});

router.get('/:category/:pageIndex', async function (ctx, next) {
  var cateName = ctx.params.category;
  await getArticles(ctx, next, cateName);
});

module.exports = router;