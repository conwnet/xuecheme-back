const model = require('../model')

let get_users = async (ctx, next) => {
  let user = ctx.user;
  let res = {
    id: user.id,
    name: user.name,
    phone: user.username,
    sex: user.sex,
    headimgurl: user.headimgurl,
    id_card: user.id_card,
    country: user.country,
    province: user.province,
    city: user.city,
    process: user.process
  }
  if(user.stu_id) res.stu_id = user.stu_id;
  if(user.coach_id) res.coach_id = user.coach_id
  ctx.rest(res);
}

let update_user = async (ctx, next) => {
  let data = ctx.request.body
  let info = {}
  if(data.sex) info.sex = data.sex
  if(data.name) info.name = data.name
  await ctx.user.update(info)
  ctx.rest({ errcode: null, errmsg: '修改成功！' })
}

module.exports = {
  'GET /api/user': get_users,
  'POST /api/user': update_user
};
