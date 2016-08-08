var router = require('koa-router')();

router.get('/', async function (ctx, next) {
  await ctx.render('server_list');
});

module.exports = router;