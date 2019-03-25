const jwt = require('jsonwebtoken');

// 处理成功响应
exports.success = ({ ctx, res = null, msg = '请求成功' })=> {
  let result = {
    code: 0,
    data: res,
    msg
  }
  ctx.body = result
  ctx.status = 200
}

// 处理其它类成功响应
exports.successOther = ({ ctx, code = 0, res = null, msg = '请求成功' })=> {
  ctx.body = {
    code: code,
    data: res,
    msg
  }
  ctx.status = 200
}

// 处理其它类成功响应
exports.successOtherWithoutData = ({ ctx, code, msg })=> {
  ctx.body = {
    code: code,
    msg
  }
  ctx.status = 200
}

// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss')

exports.createToken = (ctx, _id) => {
  return jwt.sign({
    data: {
      _id: _id
    },
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 6)
  }, ctx.app.config.jwt.secret)
}

exports.verifyToken = (ctx, token) => {
  return jwt.verify(
    token, 
    ctx.app.config.jwt.secret
  )
}