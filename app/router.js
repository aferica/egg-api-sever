'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
const userRouter = require('./routers/user');

module.exports = app => {
  const {
    router,
    controller
  } = app;
  router.get('/', controller.home.index);

  userRouter(app);
};