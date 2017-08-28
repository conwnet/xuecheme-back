let model = require('../model')

let addComment = async ctx => {
  let {content, reply = 0} = ctx.request.body;
  let status = (await model.Order.findOne({where: {user_id: ctx.user.id}})) ? 1 : 0;
  if (content) {
    await model.Comment.create({
      user_id: ctx.user.id,
      nickname: ctx.user.nickname,
      headimgurl: ctx.user.headimgurl,
      reply: reply,
      time: Date.now(),
      status: status,
      content: content
    })
    ctx.rest({
      errcode: 0,
      errmsg: '发表成功！'
    })
  } else {
    ctx.rest({
      errcode: 5001,
      errmsg: '评论内容不能为空...'
    })
  }
}

let toDate = (time = 0) => {
  let d = new Date(Number.parseInt(time));
  return (d.getYear() + 1900) + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

let getComments = async ctx => {
  let offset = ctx.query.offset || 0;
  let comments = await model.Comment.findAll({offset: offset, limit: 10, order: ['time']})
  let ret = []
  comments.forEach(item => {
    ret.push({
      nickname: item.nickname,
      date: toDate(item.time),
      headimgurl: item.headimgurl,
      status: item.status,
      content: item.content
    })
  });
  ctx.rest(ret)
}

module.exports = {
  'GET /api/comments': getComments,
  'POST /api/comment': addComment
}