var router = require('koa-router')();
var config = require('../config');
var article = require('../models/article');
var rightcomponents = require('../models/rightcomponents');

var awaitData = async function (prom) {
  var result = await prom;
  if (result.data) {
    return result.data;
  }
  return [];
}

router.get('/', async function (ctx, next) {
  var newbieGuideTask = article.getArticles({
    cateName: 'newbie_guide',
    pageIndex: 1,
    pageSize: 100
  });
  var characteristicsPlayTask = article.getArticles({
    cateName: 'characteristics_play',
    pageIndex: 1,
    pageSize: 100
  });
  var seniorPlayersTask = article.getArticles({
    cateName: 'senior_players',
    pageIndex: 1,
    pageSize: 100
  });
  var carouselsTask = rightcomponents.getCarousels();

  var newbieGuide = await awaitData(newbieGuideTask);
  var characteristicsPlay = await awaitData(characteristicsPlayTask);
  var seniorPlayers = await awaitData(seniorPlayersTask);
  var carouselList = await carouselsTask;

  var gameData = {
    newbieGuide: newbieGuide || [],
    characteristicsPlay: characteristicsPlay || [],
    seniorPlayers: seniorPlayers || [],
    carouselList: carouselList
  };
  await ctx.render('gamedata', gameData);
});

module.exports = router;