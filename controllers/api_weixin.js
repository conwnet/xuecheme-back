
const tool = require('../tool')
const model = require('../model')
const config = require('../config')
const fs = require('fs')

let authorize = async (ctx, next) => {
  // ctx.redirect(config.app.code_url + ctx.query.go)
  ctx.redirect(config.weixin.get_oauth_url(ctx.query.go))
}

let set_ssid = async (ctx, next) => {

  let res = await tool.get(config.weixin.get_openid_url(ctx.query.code))

  if(res.errcode) {
    ctx.rest({
      errcode: 1,
      errmsg: 'can not get openid'
    })
    return -1;
  }

  console.log('---------------------------openid----------------------------')
  console.log(res.openid)
  console.log('---------------------------openid----------------------------')

  let user = await model.User.findOne({where: {openid: res.openid}})

  let ssid = tool.hash(res.openid + Date.now());
  let time_out = Date.now() + 7200 * 1000

  if (!user) {
    user = {
      openid: res.openid,
      ssid: ssid,
      time_out: time_out
    }

    const access_token = await get_access_token();
    let info = await tool.get(config.weixin.get_user_info_url(access_token, res.openid))

    console.log('\n\n\n\n\n\n---------------------------openid----------------------------')
    console.log(res.openid)
    console.log('---------------------------openid----------------------------')


    if (!info.errcode) {
      user.headimgurl = info.headimgurl;
      user.name = info.nickname;
      user.country = info.country;
      user.province = info.province;
      user.city = info.city;
      user.sex = info.sex;

      console.log('\n\n\n\n\n\n---------------------------baseinfo----------------------------')
      console.log('name:', info.nickname)
      console.log('---------------------------baseinfo----------------------------')

    } else {
      return -1;
    }


    user = await model.User.create(user)
  }

  await user.update({ ssid: ssid, time_out: time_out })

  ctx.redirect(config.app.url + 'authorize?go=' + ctx.params.go + '&ssid=' + ssid + '&time_out=' + time_out);
}

let get_access_token = async () => {
  let data = fs.readFileSync('./token', 'utf8')
  let token = JSON.parse(data)
  if(token.time_out < Date.now()) {
    let res = await tool.get(config.weixin.access_token_url)
    token.access_token = res.access_token;
    token.time_out = (+ res.expires_in - 10) * 1000 + Date.now();
    fs.writeFileSync('./token', JSON.stringify(token));
  }
  return token.access_token
}

module.exports = {
  'GET /api/authorize': authorize,
  'GET /api/authorize/:go': set_ssid
}