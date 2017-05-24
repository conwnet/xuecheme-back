
const APIError = require('../middlewares/rest').APIError;
const model = require('../model');
const tool = require('../tool');
const uuid = require('node-uuid');

// 登录
let login = async (ctx, next) => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let user = await model.User.findAll({
    where: { username: username }
  });

  if(!user.length) throw new APIError('2000', 'login: username not exists');

  if(tool.hashPassword(password) !== user.password)
    throw new APIError('2001', 'bad password');

  await user.save({
    access_token: uuid.v1()
  });

  ctx.rest({
    'name': ctx.request.body.username
  });
};



module.exports = {
  'POST /api/login': login
};