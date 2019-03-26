'use strict';
const Controller = require('egg').Controller;

class UserController extends Controller {

  // 用户信息
  async show() {
    const {
      ctx,
      service
    } = this;
    // 组装参数
    const {
      id
    } = ctx.params;
    // 调用 Service 进行业务处理
    const res = await service.user.user.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({
      ctx,
      res
    });
  }
}

module.exports = UserController;