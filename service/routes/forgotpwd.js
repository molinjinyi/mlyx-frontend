var router = require('koa-router')();

// 忘记密码
router.get('/', async function (ctx, next) {
  await ctx.render('forgotpwd', {
    subnav: 'forgotpwd'
  });
});

module.exports = router;