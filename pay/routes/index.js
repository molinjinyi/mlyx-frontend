var router = require('koa-router')();
var game = require('../models/game');

router.get('/', async function (ctx, next) {
  var gamesTask = game.getGames({
    state: 1
  });
  var games = await gamesTask; 
  await ctx.render('index', {
    games: games
  });
});

module.exports = router;
