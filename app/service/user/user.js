'use strict';
const Service = require('egg').Service;

class UserService extends Service {
  // show======================================================================================================>
  async show(_id) {
    const user = await this.ctx.service.user.user.find(_id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return this.ctx.model.User.findById(_id);
  }

  async find(id) {
    return this.ctx.model.User.findById(id);
  }

}


module.exports = UserService;
