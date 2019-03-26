'use strict';

const Service = require('egg').Service;

class UserAccessService extends Service {

  async login(payload) {
    const {
      ctx,
      service
    } = this;
    const user = await service.user.user.findByUsername(payload.username);
    if (!user) {
      // ctx.throw(404, 'user not found')
      ctx.helper.successOtherWithoutData({
        ctx,
        code: 101,
        msg: '用户名不存在'
      });
    }
    const verifyPsw = await ctx.compare(payload.password, user.password);
    if (!verifyPsw) {
      // ctx.throw(404, 'user password is error')
      ctx.helper.successOtherWithoutData({
        ctx,
        code: 102,
        msg: '密码错误'
      });
    }
    ctx.session.login = true;
    // 生成Token令牌
    return {
      token: await ctx.helper.createToken(ctx, user._id)
    };
  }

}

module.exports = UserAccessService;