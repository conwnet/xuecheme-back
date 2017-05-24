
const crypto = require('crypto');
const https = require('https');
const TopClient = require( './alidayu/topClient' ).TopClient;
const config = require('./config')

let hash = function (password) {

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


let send_code = (phone, code) => {
  var client = new TopClient(config.alidayu);

  client.execute( 'alibaba.aliqin.fc.sms.num.send' , {
    'extend' : '' ,
    'sms_type' : 'normal' ,
    'sms_free_sign_name' : '身份验证' ,
    'sms_param' : "{code:'" + code + "',product:'学车么'}" ,
    'rec_num' : phone ,
    'sms_template_code' : "SMS_62860286"
  }, function(error, response) {
    if (!error) console.log(response);
    else console.log(error);
  });
}

module.exports = {
  hash,
  get,
  send_code
}