
const tool = require('../tool')
const model = require('../model')
const config = require('../config')
const fs = require('fs')
const crypto = require('crypto');

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

let get_jsapi_config = async (ctx, next) => {
  let access_token = await get_access_token()
  let ticket_json = await tool.get(config.weixin.get_ticket_url(access_token))
  if(ticket_json.errcode) {
    ctx.rest({ errcode: ticket_json.errcode, errmsg: ticket_json.errmsg })
  } else {
    let conf = {
      debug: true,
      appId: config.weixin.appid,
      timestamp: Date.now() + '',
      nonceStr: tool.nonceStr(),
      jsApiList: ['chooseWXPay', 'scanQRCode']
    }
    let str = 'jsapi_ticket=' + ticket_json.ticket + '&noncestr='
              + conf.nonceStr + '&timestamp=' + conf.timestamp + '&url=' + ctx.request.body.url

    conf.signature = tool.sha1(str)
    ctx.rest(conf);
  }
}

let get_pay_info = async (ctx, next) => {

  let clientIp = ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress || ctx.req.socket.remoteAddress || ctx.req.connection.socket.remoteAddress;
  clientIp = clientIp.match(/\d+.\d+.\d+.\d+/)
  if(clientIp) clientIp = clientIp[0]

  let data = {
    appid: config.weixin.appid,
    mch_id:	config.weixin.mch_id,
    device_info: 'weixin',
    body: 'enroll',
    nonce_str: tool.nonceStr(),
    out_trade_no: Date.now() + '' + parseInt(Math.random() * 1000000),
    total_fee: 2,
    spbill_create_ip: clientIp || '127.0.0.1',
    notify_url: config.app.url + '/pay_result',
    trade_type: 'JSAPI',
    openid: ctx.user.openid
  }

  let stringA = tool.build_qury(data) + '&key=' + config.weixin.pay_key
  data.sign = tool.md5(stringA).toUpperCase()

  let xml = tool.build_xml(data)

  let res = await tool.post(config.weixin.pay_info_url, xml)
  res = res.match(/<prepay_id><!\[CDATA\[(.*)\]\]><\/prepay_id>/)
  console.log('res', res)
  if(res.length) {
    let conf = {
      appId: config.weixin.appid,
      timeStamp: Date.now() + '',
      nonceStr: tool.nonceStr(),
      package: 'prepay_id=' + res[1],
      signType: 'MD5'
    }
    let stringA = tool.build_qury(conf) + '&key=' + config.weixin.pay_key
    console.log(stringA)
    conf.pay_sign = tool.md5(stringA).toUpperCase()
    console.log(conf.pay_sign)
    ctx.rest({
      timestamp: conf.timeStamp,
      nonceStr: conf.nonceStr,
      package: conf.package,
      signType: conf.signType,
      paySign: conf.pay_sign
    })
  } else {
    ctx.rest({ errcode: 1, errmsg: '对不起，支付失败！紧急修复中...' })
  }
}

let pay_result = async (ctx, next) => {
  console.log(ctx.request.body)
  ctx.rest({errcode: null})
}

let get_pay_sign = async (ctx, next) => {


  console.log(stringA)
  ctx.rest({

  })
}

module.exports = {
  'GET /api/authorize': authorize,
  'GET /api/authorize/:go': set_ssid,
  'POST /api/get_jsapi_config': get_jsapi_config,
  'POST /api/get_pay_info': get_pay_info,
  'POST /api/pay_result': pay_result,
  'POST /api/get_pay_sign': get_pay_sign
}