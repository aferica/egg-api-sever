'use strict';
const Controller = require('egg').Controller;

class UserAccessController extends Controller {

  constructor(ctx) {
    super(ctx);

    this.UserLoginTransfer = {
      username: {
        type: 'string',
        required: true,
        allowEmpty: false
      },
      password: {
        type: 'string',
        required: true,
        allowEmpty: false
      },
    };
  }

  // 用户登入
  async login() {
    const {
      ctx,
      service
    } = this;
    // 校验参数
    ctx.validate(this.UserLoginTransfer);
    // 组装参数
    const payload = ctx.request.body || {};
    // 调用 Service 进行业务处理
    const res = await service.user.userAccess.login(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({
      ctx,
      res
    });
  }
}

module.exports = UserAccessController;