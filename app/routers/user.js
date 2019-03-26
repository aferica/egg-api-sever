'use strict';

module.exports = app => {
  const {
    router,
    controller
  } = app;

  router.post('/user/access/login', controller.user.userAccess.login);
  router.resources('user', '/api/user', controller.user.user);
};