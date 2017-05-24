const model = require('../model');

let get_plans = async (ctx, next) => {
  let where = {};
  let year = ctx.query.year;
  let month = ctx.query.month;
  let date = ctx.query.date;
  let coach_id = ctx.query.coach_id;
  if(year) where.year = year;
  if(month) where.month = month;
  if(date) where.date = date;
  if(coach_id) where.coach_id = coach_id;

  let plans = await model.Plan.findAll({ where: where })

  let res = []
  if(plans.length) {
    plans.forEach(plan => {
      res.push({
        coach_id: plan.coach_id,
        year: plan.year,
        month: plan.month,
        date: plan.date,
        content: plan.content
      })
    })
  } else {
    res.push({
      coach_id: coach_id,
      year: year,
      month: month,
      content: '[{"start":500,"end":540},{"start":520,"end":560},{"start":540,"end":580},{"start":560,"end":600},{"start":580,"end":620},{"start":600,"end":640},{"start":620,"end":660},{"start":640,"end":680},{"start":660,"end":720},{"start":780,"end":820},{"start":800,"end":840},{"start":820,"end":86},{"start":840,"end":880},{"start":860,"end":900},{"start":880,"end":920},{"start":900,"end":940},{"start":920,"end":960},{"start":940,"end":980},{"start":960,"end":1000},{"start":980,"end":1020},{"start":1000,"end":1040}]',
    })
  }

  ctx.rest(res)
}


module.exports = {
  'GET /api/plan': get_plans,
};



