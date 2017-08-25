
let getSsid = async ctx => {
  ctx.rest({
    ssid: 'ssid',
    timeout: Date.now() + 7200 * 1000
  })
}

module.exports = {
  'GET /api/ssid': getSsid
}