var router = require('koa-router')();
var config = require('../config');
var carousel = require('../models/carousel');
var article = require('../models/article');

var timeLogs = [];

var awaitData = async function (prom) {
  var result = await prom;
  if (result.data) {
    return result.data;
  }
  return [];
}

router.get('/', async function (ctx, next) {
  timeLogs = [];

  var carouselsTask = carousel.getCarousels({
    catnames: 'index_carousel1,index_carousel2,index_pieceinfo,index_videoappreciation,index_gamedata'
  });
  var newsTask = article.getArticles({
    cateName: 'events,announcements',
    pageIndex: 1,
    pageSize: 5
  });
  var announcementsTask = article.getArticles({
    cateName: 'announcements',
    pageIndex: 1,
    pageSize: 5
  });
  var eventsTask = article.getArticles({
    cateName: 'events',
    pageIndex: 1,
    pageSize: 5
  });
  var pieceInformationTask = article.getArticles({
    cateName: 'piece_information',
    pageIndex: 1,
    pageSize: 5
  });
  var newbieGuideTask = article.getArticles({
    cateName: 'newbie_guide',
    pageIndex: 1,
    pageSize: 7
  });
  var characteristicsPlayTask = article.getArticles({
    cateName: 'characteristics_play',
    pageIndex: 1,
    pageSize: 7
  });
  var seniorPlayersTask = article.getArticles({
    cateName: 'senior_players',
    pageIndex: 1,
    pageSize: 7
  });
  var forumActivitiesTask = article.getArticles({
    cateName: 'forum_activities',
    pageIndex: 1,
    pageSize: 3
  });
  var playerGuideTask = article.getArticles({
    cateName: 'player_guide',
    pageIndex: 1,
    pageSize: 3
  });

  var carousels = await awaitData(carouselsTask);

  var carouselList = {};
  for(var i=0,j=carousels.length;i<j;i++){
    var item = carousels[i];
    item.data = JSON.parse(item.data);
    if(!carouselList[item.catname]){
      carouselList[item.catname] = [];
    }
    carouselList[item.catname].push(item);
  }

  var news = await awaitData(newsTask);
  var announcements = await awaitData(announcementsTask);
  var events = await awaitData(eventsTask);
  var pieceInformation = await awaitData(pieceInformationTask);
  var newbieGuide = await awaitData(newbieGuideTask);
  var characteristicsPlay = await awaitData(characteristicsPlayTask);
  var seniorPlayers = await awaitData(seniorPlayersTask);
  var forumActivities = await awaitData(forumActivitiesTask);
  var playerGuide = await awaitData(playerGuideTask);

  var indexData = {
    categories: [{
      ename: 'news',
      cname: '最新资讯',
      url: config.site_url.news_center
    }, {
      ename: 'announcements',
      cname: '公告',
      url: config.site_url.news_center + '/announcements'
    }, {
      ename: 'events',
      cname: '活动',
      url: config.site_url.news_center + '/events'
    }],
    carousels: carousels || [],
    carouselList: carouselList || {},
    news: news || [],
    announcements: announcements || [],
    events: events || [],
    pieceInformation: pieceInformation || [],
    newbieGuide: newbieGuide || [],
    characteristicsPlay: characteristicsPlay || [],
    seniorPlayers: seniorPlayers || [],
    forumActivities: forumActivities || [],
    playerGuide: playerGuide || [],
    timeLogs: timeLogs
  };
  await ctx.render('index', indexData);
});

module.exports = router;