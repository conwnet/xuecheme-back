const fs = require('fs');
const crypto = require('crypto');
const request = require('request')
const https = require('https')
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

let sendCode = (phone, code) => {
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
  let str = sha1('' + Math.random());
  return str.slice(str.length - 20);
}

let getAccessToken = () => {
  return new Promise(resolve => {
    let token = fs.existsSync('./token') && fs.readFileSync('./token');
    let access = token ? JSON.parse(token) : false;
    if(access && access.timeout - 600 * 1000 > Date.now()) {
      resolve(access.token);
    } else {
      https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.weixin.appid}&secret=${config.weixin.secret}`, response => {
        response.setEncoding('utf8');
        response.on('data', chunk => {
          let data = JSON.parse(chunk);
          fs.writeFileSync('./token', JSON.stringify({
            token: data.access_token,
            timeout: parseInt(data.expires_in) * 1000 + Date.now()
          }))
          resolve(data.access_token)
        });
      });
    }
  })
}

let getJsApiTicket = token => {
  return new Promise(resolve => {
    let ticket = fs.existsSync('./ticket') && fs.readFileSync('./ticket');
    let jsapi = ticket ? JSON.parse(ticket) : false;
    if(jsapi && jsapi.timeout - 60 * 1000 > Date.now()) {
      resolve(jsapi.ticket);
    } else {
      https.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`, response => {
        response.setEncoding('utf8');
        response.on('data', chunk => {
          let data = JSON.parse(chunk);
          fs.writeFileSync('./ticket', JSON.stringify({
            ticket: data.ticket,
            timeout: parseInt(data.expires_in) * 1000 + Date.now()
          }))
          resolve(data.ticket)
        });
      });
    }
  })
}

module.exports = {
  hash,
  get,
  post,
  sha1,
  sendCode,
  nonceStr,
  getAccessToken,
  getJsApiTicket
}