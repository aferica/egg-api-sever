const jwt = require('jsonwebtoken');

// 处理成功响应
exports.success = ({
  ctx,
  res = null,
  msg = '请求成功'
}) => {
  let result = {
    code: 0,
    data: res,
    msg
  }
  ctx.body = result
  ctx.status = 200
}

// 处理其它类成功响应
exports.successOther = ({
  ctx,
  code = 0,
  res = null,
  msg = '请求成功'
}) => {
  ctx.body = {
    code: code,
    data: res,
    msg
  }
  ctx.status = 200
}

// 处理其它类成功响应
exports.successOtherWithoutData = ({
  ctx,
  code,
  msg
}) => {
  ctx.body = {
    code: code,
    msg
  }
  ctx.status = 200
}

// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss')

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