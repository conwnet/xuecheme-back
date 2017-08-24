module.exports = {
  APIError: function (code, message) {
    this.code = code || 'internal:unknown_error';
    this.message = message || '';
  },
  restify: (pathPrefix) => {
    pathPrefix = pathPrefix || '/';
    return async (ctx, next) => {
      if (ctx.request.path.startsWith(pathPrefix)) {
        // console.log(`Process API ${ctx.request.method} ${ctx.request.url}...`);
        ctx.rest = (data) => {
          ctx.response.type = 'application/json';
          ctx.response.body = data;
          console.log(data)
        }
        try {
          await next();
        } catch (e) {
          console.log('Process API error...', e.message);
          ctx.response.status = 500;
          ctx.response.type = 'application/json';

          ctx.response.body = {
            errcode: e.code || 'internal:unknown_error',
            errmsg: '系统错误！' || e.message || ''
          };
        }
      } else {
        await next();
      }
    };
  }
};