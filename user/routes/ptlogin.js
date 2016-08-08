var router = require('koa-router')();

router.get('/', async function (ctx, next) {
  await ctx.render('ptlogin', {
  });
});

module.exports = router;
