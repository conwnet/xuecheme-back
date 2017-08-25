const OAuth = require('wechat-oauth');
const config = require('../config')
const path = require('path')
const model = require('../model')
const crypto = require('crypto')

let client = new OAuth(config.weixin.appid, config.weixin.secret);    

let getOauthUrl = async ctx => {
  //let url = client.getAuthorizeURL(ctx.query.ctx, 'MoMaKeJi', 'snsapi_userinfo')
  let reqUrl = 'http://' + ctx.host + ctx.url;
  let url = client.getAuthorizeURL(reqUrl, 'MoMaKeJi', 'snsapi_userinfo')  
  ctx.rest({ url: url});
}

let getAccessToken = code => new Promise((resolve, reject) => {
  client.getAccessToken(code, (err, result) => {
    if(err) reject({ errcode: 1, errmsg: 'Can not get openid.' });
    else resolve({ openid: result.data.openid, accessToken: result.data.access_token })
  })
})

let getUserInfo = openid => new Promise((resolve, reject) => {
  client.getUser(openid, function (err, result) {
    if(err) reject({ errcode: 1, errmsg: 'Can not get userinfo.' });
    else resolve({userInfo: result});
  });
})

let sha256 = str => {
  let sha256 = crypto.createHash('sha256');
  sha256.update(str);
  return sha256.digest('hex');
}

let authorize = async ctx => {
  let code = ctx.query.code;
  try {
    let {openid, accessToken} = await getAccessToken(code);  
    let user = model.User.findOne({ openid: openid });
    let ssid = sha256('MoMaKeJi' + Data.now() + Math.random());
    let timeout = Date.now() + 7200 * 1000;
    if(user) {
      await user.update({
        ssid: ssid,
        timeout: timeout
      })
    } else {
      let userInfo = await getUserInfo(openid);
      await model.User.create({
        openid: userInfo.openid,
        nickname: userInfo.nickname,
        age: userInfo.age,
        sex: userInfo.sex,
        city: userInfo.city,
        province: userInfo.province,
        country: userInfo.country,
        headimgurl: userInfo.headimgurl,
        ssid: ssid,
        timeout: timeout
      })
    }
    ctx.rest({
      ssid: ssid
    }); 
       
  } catch (e) {
    ctx.rest({
      errcode: -1,
      errmsg: 'invalid code...'
    })
  }
}

module.exports = {
  'GET /api/oauthurl': getOauthUrl,
  'GET /api/authorize': authorize
};