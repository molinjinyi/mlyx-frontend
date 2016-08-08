var router = require('koa-router')();
var recharge = require('../models/recharge');

router.get('/', async function (ctx, next) {
  await ctx.render('payend');
});

module.exports = router;
