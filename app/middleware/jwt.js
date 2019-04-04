'use strict';

module.exports = () => {
  return async function (ctx, next) {
    let authToken = ctx.header.authorization;
    if (authToken) {
      authToken = authToken.substring(7);
      const res = await ctx.helper.verifyToken(ctx, authToken);
      if (res && res.exp > Math.floor(Date.now() / 1000)) {
        ctx.locals.user = res.data;
        await next();
      } else {
        ctx.helper.successOtherWithoutData({
          ctx,
          code: 401,
          msg: '登录状态已过期,请重新登陆'
        });
      }
    } else {
      ctx.helper.successOtherWithoutData({
        ctx,
        code: 401,
        msg: '请登陆后再进行操作'
      });
    }
  }
}
