module.exports = {
  'GET /': async (ctx, next) => {
    ctx.response.body="<h1>Hello World!</h1>"
  }
};