const OAuth = require('wechat-oauth');
const config = require('../config')
const path = require('path')

let client = new OAuth(config.weixin.appid, config.weixin.secret);    

let getOauthUrl = async ctx => {
  let url = client.getAuthorizeURL(config.url + 'authorize', 'MoMaKeJi', 'snsapi_userinfo')
  ctx.rest({
    url: url
  });
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

let authorize = async ctx => {
  let code = ctx.query.code;
  try {
    let {openid, accessToken} = await getAccessToken(code);
    let userInfo = await getUserInfo(openid);
    ctx.rest(userInfo);    
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  'GET /api/oauthurl': getOauthUrl,
  'GET /api/authorize': authorize
};