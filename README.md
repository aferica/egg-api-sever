# api-sever

An API server template developed using egg
一个使用[阿里egg](https://eggjs.org/zh-cn/)开发RESTful API服务器模板

### 使用

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```
更过用法和命令可查阅[egg文档](https://eggjs.org/zh-cn/)

### 说明
该项目是使用egg + mongodb + jsonwebtoken实现的一个简单的RESTful API服务器模板  

### 项目结构
该目录说明来源中egg文档，具体可查[目录结构](https://eggjs.org/zh-cn/basics/structure.html)
```
egg-project
├── package.json
├── app
|   ├── router.js             // 路由主文件
|   ├── routers               // 路由文件夹（主要是用于区分模块，方便日后的维护和查阅）
│   |   └── user.js           // 用户模块路由
│   ├── controller
│   |   └── user.js
│   ├── model (可选)          // 使用egg-mongoose管理mongodb的model文件 * 该文件夹下最好不要在添加文件夹，会出现model找不到的问题
│   |   └── user.js
│   ├── service (可选)        // 主要业务逻辑
│   |   └── user.js
│   ├── middleware (可选)     // 中间件
│   |   └── jwt.js
│   └── extend (可选)
│       ├── helper.js (可选)
├── config
|   ├── plugin.js
|   ├── config.default.js
│   ├── config.prod.js
|   ├── config.test.js (可选)
|   ├── config.local.js (可选)
|   └── config.unittest.js (可选)
```
如上，由框架约定的目录：

- app/router.js 用于配置 URL 路由规则，具体参见 Router。
- app/controller/** 用于解析用户的输入，处理后返回相应的结果，具体参见 Controller。
- app/service/** 用于编写业务逻辑层，可选，建议使用，具体参见 Service。
- app/middleware/** 用于编写中间件，可选，具体参见 Middleware。
- app/public/** 用于放置静态资源，可选，具体参见内置插件 egg-static。
- app/extend/** 用于框架的扩展，可选，具体参见框架扩展。
- config/config.{env}.js 用于编写配置文件，具体参见配置。
- config/plugin.js 用于配置需要加载的插件，具体参见插件。
- app.js 和 agent.js 用于自定义启动时的初始化工作，可选，具体参见启动自定义。关于agent.js的作用参见Agent机制。
由内置插件约定的目录：
- app/public/** 用于放置静态资源，可选，具体参见内置插件 egg-static。
- app/schedule/** 用于定时任务，可选，具体参见定时任务。

### jwt验证
实现思路来自  
[egg基于jsonwebtoken的Token实现认证机制](https://segmentfault.com/a/1190000017248226#articleHeader6)  
作者[坏壊ヤ孩孓气](https://segmentfault.com/u/huaixsheng)  

- 在middleware文件下新建一个jwt.js文件
``` js
'use strict';

module.exports = () => {
  return async function(ctx, next) {
    let authToken = ctx.header.authorization;
    if (authToken) {
      authToken = authToken.substring(7);
      const res = await ctx.helper.verifyToken(ctx, authToken);
      if(res.exp > Math.floor(Date.now() / 1000)) {
        // 在其它页面可以使用  this.ctx.locals.user  来获取该值
        ctx.locals.user = res.data;
        await next();
      } else {
        ctx.helper.successOtherWithoutData({ctx, code: 401, msg: '登录状态已过期,请重新登陆'});
      }
    } else {
      ctx.helper.successOtherWithoutData({ctx, code: 401, msg: '请登陆后再进行操作'});
    }
  }
}
```
- 在extend/helper.js中实现jwt token的生成和验证
``` js
// 生成token
exports.createToken = (ctx, _id) => {
  return jwt.sign({
    data: {
      _id: _id
    },
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 6)
  }, ctx.app.config.jwt.secret)
}

// 验证token
exports.verifyToken = (ctx, token) => {
  let result = {};
  try {
    result = jwt.verify(
      token,
      ctx.app.config.jwt.secret
    );
  } catch (err) {
    // err
  } finally {
    return result;
  }
}
```

### 使用
在config.js文件中设置需要验证的路径
``` js
  jwt: {
    secret: 'JWTTOKEN', // jwt加密密钥，自定义
    enable: true,
    match: '/api'  // 路径匹配，以/api开头的请求需要验证
  },
```
在需要验证的请求的header中添加验证
```
Authorization: Bearer + token
```