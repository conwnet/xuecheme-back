
const APIError = require('../middlewares/rest').APIError;
const model = require('../model');

let add_school_label = async (ctx, next) => {
  let data = ctx.request.body;
  await model.SchoolLabel.create(data);
  ctx.rest({ 'error': null });
};

let get_school_labels = async (ctx, next) => {
  where = {}
  if(ctx.query.school_id) where.school_id = ctx.query.school_id
  let packages = await model.SchoolLabel.findAll({where: where, limit: 3});
  console.log(typeof ctx.query)
  ctx.rest(packages);
}

let get_school_label = async (ctx, next) => {
  let school_label = await model.SchoolLabel.findById(ctx.params.id);
  ctx.rest(school_label);
};

let update_school_label = async (ctx, next) => {
  let data = ctx.request.body;
  let school_label = await model.SchoolLabel.findById(ctx.params.id);
  await school_label.update(data);
  ctx.rest({ 'error': null });
};

let delete_school_label = async (ctx, next) => {
  let school_label = await model.SchoolLabel.findById(ctx.params.id);
  await school_label.destroy();
  ctx.rest({ 'error': null });
}

module.exports = {
  'GET /api/school_label': get_school_labels,
  'GET /api/school_label/:id': get_school_label,
  'POST /api/school_label': add_school_label,
  'DELETE /api/school_label/:id': delete_school_label,
  'PUT /api/school_label/:id': update_school_label
};