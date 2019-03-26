/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1553503405591_8660';

  // add your middleware config here
  config.middleware = ['jwt'];


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    jwt: {
      secret: 'JWTTOKEN', // jwt加密密钥，自定义
      enable: true,
      match: '/api' // 路径匹配，以/api开头的请求需要验证
    },
    // 可以修改启动端口  默认7001
    cluster: {
      listen: {
        port: 7001,
        hostname: '0.0.0.0',
      },
    },
    // mongodb配置
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/data',
        options: {},
      }
    },
    // csrf禁用
    security: {
      csrf: {
        enable: false,
      },
    },
    // 加密
    bcrypt: {
      saltRounds: 10 // default 10
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};