'use strict';
const Service = require('egg').Service;

class UserService extends Service {
  // create======================================================================================================>
  async create(payload) {
    const { ctx } = this;
    payload.password = await this.ctx.genHash(payload.password);
    return ctx.model.User.create(payload);
  }

  // destroy======================================================================================================>
  async destroy(_id) {
    const { ctx } = this;
    const user = await ctx.service.user.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndRemove(_id);
  }

  // update======================================================================================================>
  async update(_id, payload) {
    const { ctx } = this;
    const user = await ctx.service.user.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndUpdate(_id, payload);
  }

  // show======================================================================================================>
  async show(_id) {
    const user = await this.ctx.service.user.user.find(_id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return this.ctx.model.User.findById(_id);
  }

  // index======================================================================================================>
  async index(payload) {
    let { currentPage, pageSize, isPaging, search } = payload;
    if (currentPage == null || currentPage === '') {
      currentPage = '1';
    }
    if (pageSize == null || pageSize === '') {
      pageSize = '20';
    }
    let res = [];
    let count = 0;
    const skip = ((Number(currentPage)) - 1) * Number(pageSize || 10);
    if (isPaging) {
      if (search) {
        res = await this.ctx.model.User.find({ mobile: { $regex: search } }).skip(skip).limit(Number(pageSize))
          .sort({ createdAt: -1 })
          .exec();
        count = res.length;
      } else {
        res = await this.ctx.model.User.find({}).skip(skip).limit(Number(pageSize))
          .sort({ createdAt: -1 })
          .exec();
        count = await this.ctx.model.User.count({}).exec();
      }
    } else {
      if (search) {
        res = await this.ctx.model.User.find({ mobile: { $regex: search } }).sort({ createdAt: -1 }).exec();
        count = res.length;
      } else {
        res = await this.ctx.model.User.find({}).sort({ createdAt: -1 }).exec();
        count = await this.ctx.model.User.count({}).exec();
      }
    }
    // 整理数据源 -> Ant Design Pro
    const data = res.map((e, i) => {
      const jsonObject = Object.assign({}, e._doc);
      jsonObject.key = i;
      delete jsonObject.password;
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt);
      return jsonObject;
    });

    return { count, list: data, pageSize: Number(pageSize), currentPage: Number(currentPage) };
  }


  async removes(payload) {
    return this.ctx.model.User.remove({ _id: { $in: payload } });
  }

  // Commons======================================================================================================>
  async findByMobile(mobile) {
    return this.ctx.model.User.findOne({ mobile });
  }

  async findByUsername(username) {
    return this.ctx.model.User.findOne({ username });
  }

  async find(id) {
    return this.ctx.model.User.findById(id);
  }

  async findByIdAndUpdate(id, values) {
    return this.ctx.model.User.findByIdAndUpdate(id, values);
  }


}


module.exports = UserService;
