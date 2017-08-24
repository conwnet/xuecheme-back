const model = require('../model');

let get_coaches = async (ctx, next) => {
  // 只显示某个驾校的教练
  let where = {}
  if(ctx.query.school_id) where.school_id = ctx.query.school_id

  let coaches = await model.Coach.findAll({ where: where })
  let res = []
  for(let coach of coaches) {
    let user = await model.User.findByPrimary(coach.user_id)
    res.push({
      id: user.id,
      coach_id: coach.id,
      name: user.name,
      sex: user.sex,
      city: user.city,
      headimgurl: user.headimgurl,
      score: coach.score,
    })
  }
  ctx.rest(res);
}

let get_coach = async (ctx, next) => {
  let coach = await model.Coach.findByPrimary(ctx.params.id)
  if (!coach) {
    ctx.rest({
      errcode: 1,
      errmsg: '没有这个教练'
    })
  }
  let user = await model.User.findByPrimary(coach.user_id)
  ctx.rest({
    id: user.id,
    coach_id: coach.id,
    name: user.name,
    headimgurl: user.headimgurl,
    score: coach.score,
    city: user.city,
    labels: '[]'
  })
}


module.exports = {
  'GET /api/coach': get_coaches,
  'GET /api/coach/:id': get_coach
};



