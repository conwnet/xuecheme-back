const tenpay = require('tenpay');
const config = require('../config');
const tool = require('../tool')
const model = require('../model')

let payConfig = {
	appid: config.weixin.appid,
	mchid: config.wxpay.mchid,
	partnerKey: config.wxpay.partnerKey,
	notify_url: config.server.url + 'wxPayNotify'
};

let api = new tenpay(payConfig);

let wxPayNotify = async ctx => {
  let xml = ctx.request.body.xml;
  if(xml.return_code[0] == 'SUCCESS') {
    let out_trade_no = xml.out_trade_no[0];
    let user = await model.User.findOne({where: {trade_no: out_trade_no}});
    let order = await model.Order.findOne({where: {trade_no: out_trade_no}});
    if(user && !order) {
      await model.Order.create({
        user_id: user.id,
        trade_no: user.trade_no,
        price: user.total_fee,
        pack_id: user.pack_id,
        time: Date.now()
      })
      await model.Promo.create({
        code: tool.md5(user.openid + Date.now()),
        power: 10000,
        times: 1,
        user_id: user.id
      });
      ctx.response.body = `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`;
    }
  }
}

getJsSdkConfig = async ctx => {
  let token = await tool.getAccessToken();
  let ticket = await tool.getJsApiTicket(token);
  let nonceStr = 'MMKJ' + Date.now();
  let timestamp = Math.ceil(Date.now() / 1000);
  let url = ctx.query.url;
  let signature = tool.sha1(['jsapi_ticket=' + ticket,
    'noncestr=' + nonceStr, 'timestamp=' + timestamp, 'url=' + url].join('&'));
  ctx.rest({
    appId: config.weixin.appid,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: ['chooseWXPay']
  })
}

let getPayParams = async ctx => {
  let order = {
    out_trade_no: ctx.user.trade_no,
    body: '学车么 - 报名',
    total_fee: ctx.user.total_fee,
    openid: ctx.user.openid
  }
  try {
    ctx.rest(await api.getPayParams(order))
  } catch(e) {
    console.log(e)
  }
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
  'GET /api/jsSdkConfig': getJsSdkConfig,
  'POST /wxPayNotify': wxPayNotify
}
