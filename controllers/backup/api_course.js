
const APIError = require('../middlewares/rest').APIError;
const model = require('../model');

let add_course = async (ctx, next) => {
  let data = ctx.request.body;
  if(ctx.user.stu_id) {
    data.stu_id = ctx.user.stu_id;
    where = {
      coach_id: data.coach_id,
      year: data.year,
      month: data.month,
      date: data.date,
      start: data.start,
      end: data.end
    }
    let course = await model.Course.find({ where: where })
    if (course) {
      ctx.rest({
        errcode: 1,
        errmsg: '好可惜，您手慢了，这节课已经被抢了～'
      })
    } else {
      await model.Course.create(data)
      ctx.rest({
        errcode: 0,
        errmsg: '预约成功！'
      })
    }
  } else {
    ctx.rest({
      errcode: 1,
      errmsg: '您还未报考驾校呦～'
    })
  }
};

let get_courses = async (ctx, next) => {
  where = {}
  let coach_id = ctx.query.coach_id
  let year = ctx.query.year
  let month = ctx.query.month
  let date = ctx.query.date
  where.coach_id = coach_id
  where.year = year
  where.month = month
  where.date = date

  let courses = await model.Course.findAll({ where: where })

  let res = []
  courses.forEach(course => {
    res.push({
      coach_id: course.coach_id,
      year: course.year,
      month: course.month,
      date: course.date,
      start: course.start,
      end: course.end
    })
  })
  ctx.rest(res);
}

let get_course = async (ctx, next) => {
  let course = await model.Course.findById(ctx.params.id);
  ctx.rest(course);
};

let update_course = async (ctx, next) => {
  let data = ctx.request.body;
  let package = await model.Package.findById(ctx.params.id);
  await package.update(data);
  ctx.rest({ 'error': null });
};

let delete_course = async (ctx, next) => {
  let package = await model.Package.findById(ctx.params.id);
  await package.destroy();
  ctx.rest({ 'error': null });
}

module.exports = {
  'GET /api/course': get_courses,
  'GET /api/course/:id': get_course,
  'POST /api/course': add_course
};