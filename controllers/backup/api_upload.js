
let upload_user_header = async (ctx, next) => {
  console.log(ctx.request.body)
}

module.exports = {
  'POST /api/upload/user/headimg': upload_user_header
};
