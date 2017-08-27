
let getUserInfo = async ctx => {
  ctx.rest({
    nickname: ctx.user.nickname
  });
}

module.exports = {
  'GET /api/user': getUserInfo
}