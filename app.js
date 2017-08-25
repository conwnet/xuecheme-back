const Koa = require('koa');
const cors = require('kcors')
const bodyParser = require('koa-bodyparser');
const controller = require('./middlewares/controller');
const rest = require('./middlewares/rest');
const authorize = require('./middlewares/authorize')

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

app.use(cors())

// bind .rest() for ctx:
app.use(rest.restify());

// use wechat authorize
app.use(authorize)

// parse request body:
app.use(bodyParser());

// add controllers:
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');