
const crypto = require('crypto');
const https = require('https');
const request = require('request')
const TopClient = require( './alidayu/topClient' ).TopClient;
const config = require('./config')

let hash = password => {

  let __SALT = 'CoNw.NeT';
  let sha256 = crypto.createHash('sha256');
  sha256.update(__SALT + password);
  return sha256.digest('hex');
}

let get = url => {
  return new Promise(resolve => {
    https.get(url, response => {
      response.setEncoding('utf8');
      response.on('data', chunk => {
        resolve(JSON.parse(chunk))
      });
    });
  });
}

let post = (url, data) => {
  return new Promise(resolve => {
    const request = require('request')
    let form = data
    request.post({ url:url, form:form }, (err,res,body) => {
      if(err) console.log(err)
      resolve(body)
    })
  });
}

let sha1 = str => {
  let sha1 = crypto.createHash('sha1');
  sha1.update(str);
  return sha1.digest('hex');
}

let md5 = str => {
  let md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('hex')
}

let build_xml = obj => {
  let xml = '<xml>\n'
  for(let key in obj) {
    xml += '<' + key + '>' + obj[key] + '</' + key + '>\n';
  }
  xml += '</xml>'
  return xml
}

let build_qury = (data) => {
  let querys = []
  for(let key in data) {
    querys.push(key + '=' + data[key])
  }
  return querys.sort().join('&')
}

let send_code = (phone, code) => {
  var client = new TopClient(config.alidayu);

  client.execute( 'alibaba.aliqin.fc.sms.num.send' , {
    'extend' : '',
    'sms_type' : 'normal',
    'sms_free_sign_name' : '身份验证',
    'sms_param' : JSON.stringify({code: code, product:'学车么'}),
    'rec_num' : '' + phone,
    'sms_template_code' : "SMS_62860286"
}, function(error, response) {
    if (!error) console.log(response);
    else console.log(error);
});
}

let nonceStr = () => {
  let str = sha1('' + Math.random())
  return str.slice(str.length - 20)
}

let wechatPay = (trade_no, body, fee, ip, openid) => {
  let Payment = require('wechat-pay').Payment;
  let initConfig = {
    partnerKey: "<partnerkey>",
    appId: "<appid>",
    mchId: "<mchid>",
    notifyUrl: "<notifyurl>",
    // pfx: fs.readFileSync("<location-of-your-apiclient-cert.p12>")
  };
  let payment = new Payment(initConfig);
  let order = {
    body: body,
    attach: 'netcon',
    out_trade_no: trade_no,
    total_fee: fee,
    spbill_create_ip: req.ip,
    openid: openid,
    trade_type: 'JSAPI'
  };
}

module.exports = {
  hash,
  get,
  post,
  md5,
  sha1,
  send_code,
  build_qury,
  build_xml,
  nonceStr
}