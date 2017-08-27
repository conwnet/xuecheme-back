const tenpay = require('tenpay');
const config = require('../config');
const tool = require('../tool')

let payConfig = {
	appid: config.weixin.appid,
	mchid: config.wxpay.mchid,
	partnerKey: config.wxpay.partnerKey,
	notify_url: config.serverUrl + 'wxPayNotify'
};

let api = new tenpay(payConfig);

let wxPayNotify = async ctx => {

}

getJsSdkConfig = async ctx => {
  let token = await tool.getAccessToken();
  let ticket = await tool.getJsApiTicket(token);
  let nonceStr = 'MMKJ' + Date.now() + Math.random();
  let timestamp = Date.now();
  let url = ctx.query.url;
  console.log('url', url);
  let signature = tool.sha1([ticket, nonceStr, timestamp, url].join('&'));

  ctx.rest({
    debug: true,
    appId: config.weixin.appid,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: ['chooseWXPay']
  })
}

let getPayParams = async ctx => {
  let order = {
    out_trade_no: 'xcm' + Date.now(),
    body: '学车么 - 报名',
    total_fee: 1,
    openid: 'o8rEnwPLHZzg5Ig-Y_3SDDhSUFT8'
  }
  ctx.rest(await api.getPayParams(order))
}

let getToken = async ctx => {
  let token = await tool.getAccessToken();
  ctx.rest({
    token: await tool.getJsApiTicket(token)
  })
}

module.exports = {
  'GET /api/payParams': getPayParams,
  'GET /api/token': getToken,
  'GET /api/jsSdkConfig': getJsSdkConfig
}