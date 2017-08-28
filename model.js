
const Sequelize = require('sequelize');
const config = require('./config');

var sequelize = new Sequelize(config.database.dbname, config.database.username, config.database.password, {
  host: config.database.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000
  }
});

// 用户列表
let User = sequelize.define('user', {
  mobile: { type: Sequelize.STRING(255), defaultValue: '' }, // 手机号，用作登录，通常应该绑定手机号
  password: { type: Sequelize.STRING(255), defaultValue: '' }, // 密码，用来在 App 端登录

  openid: { type: Sequelize.STRING(255), defaultValue: '' }, // 微信获取的 open_id，用来在微信端识别每个用户
  nickname: { type: Sequelize.STRING(255), defaultValue: '' }, // 用户姓名  
  age: { type: Sequelize.INTEGER, defaultValue: 0 }, // 用户年龄
  sex: { type: Sequelize.INTEGER, defaultValue: 0 }, // 用户性别
  city: { type: Sequelize.STRING(255), defaultValue: '' }, // 用户国家
  province: { type: Sequelize.STRING(255), defaultValue: '' }, // 用户国家
  country: { type: Sequelize.STRING(255), defaultValue: '' }, // 用户国家
  headimgurl: { type: Sequelize.STRING(255), defaultValue: '' }, // 用户头像 url

  access_token: { type: Sequelize.STRING(255), defaultValue: '' }, // 微信 ACCESS_TOKEN
  access_time: { type: Sequelize.BIGINT, defaultValue: 0 }, // ACCESS_TOKEN 创建时间

  ssid: { type: Sequelize.STRING(255), defaultValue: '' }, // 系统登录验证 token
  timeout: { type: Sequelize.BIGINT, defaultValue: 0 }, // token 创建时间

  verify_phone: { type: Sequelize.STRING(255), defaultValue: '' }, // 临时手机号
  verify_code: { type: Sequelize.STRING(255), defaultValue: '' }, // 验证码
  verify_timeout: { type: Sequelize.BIGINT, defaultValue: 0 }, // 验证码失效时间

  pack_id: Sequelize.INTEGER,
  trade_no: { type: Sequelize.STRING(255), defaultValue: '' }, // 支付订单号
  total_fee: { type: Sequelize.INTEGER, defaultValue: 999999 } // 支付金额
});

let Promo = sequelize.define('promo', {
  code: Sequelize.STRING(255),
  power: Sequelize.INTEGER,
  times: Sequelize.INTEGER,
  user_id: Sequelize.INTEGER
});

// 订单列表
let Order = sequelize.define('order', {
  user_id: Sequelize.INTEGER, // 用户 id
  trade_no: Sequelize.STRING(255),
  price: Sequelize.INTEGER, // 购买该套餐时所花费用
  pack_id: Sequelize.INTEGER, // 套餐列表
  time: Sequelize.BIGINT
});

let Comment = sequelize.define('comment', {
  user_id: Sequelize.INTEGER,
  nickname: Sequelize.STRING(255),
  headimgurl: Sequelize.STRING(255),
  reply: Sequelize.INTEGER,
  time: Sequelize.BIGINT,
  status: Sequelize.INTEGER,
  content: Sequelize.STRING(1023)
})

let Student = sequelize.define('student', {
  user_id: { type: Sequelize.INTEGER }, // user_id
  school_id: { type: Sequelize.INTEGER }, // 用户所在驾校 id
  process: { type: Sequelize.STRING(255), defaultValue: '' }, // 学车进度
  user_122: { type: Sequelize.STRING(255), defaultValue: '' }, // 交管 122 用户名
  pass_122: { type: Sequelize.STRING(255), defaultValue: '' }, // 交管 122 密码
  info_1: { type: Sequelize.STRING(1023), defaultValue: '' }, // 科目一信息
  info_2: { type: Sequelize.STRING(1023), defaultValue: '' }, // 科目二信息
  info_3: { type: Sequelize.STRING(1023), defaultValue: '' }, // 科目三信息
  info_4: { type: Sequelize.STRING(1023), defaultValue: '' }, // 科目四信息
})

let Coach = sequelize.define('coach', {
  user_id: { type: Sequelize.INTEGER }, // user_id
  school_id: { type: Sequelize.INTEGER }, // 用户所在驾校 id
  bannnerimg_list: { type: Sequelize.STRING(2047), defaultValue: '[]' }, // Banner 图片列表，JSON 形式存储
  score: Sequelize.INTEGER, // 用户评分
})

// 驾校列表
let School = sequelize.define('school', {
  name: { type: Sequelize.STRING(255), defaultValue: '' }, // 驾校名称
  province: { type: Sequelize.STRING(255), defaultValue: '' }, // 驾校省份
  city: { type: Sequelize.STRING(255), defaultValue: '' }, // 驾校城市
  address: { type: Sequelize.STRING(255), defaultValue: '' }, // 驾校地址
  headimgurl: { type: Sequelize.STRING(255), defaultValue: '' }, // 头像地址
  bannerimg_list: { type: Sequelize.STRING(2047), defaultValue: '[]' }, // Banner 图片列表，JSON 形式存储
  score: { type: Sequelize.INTEGER, defaultValue: 5 }, // 驾校评分
  count: { type: Sequelize.INTEGER, defaultValue: 0 }, // 报名人数
  status: { type: Sequelize.INTEGER, defaultValue: 0 }, // 状态
  remark: { type: Sequelize.STRING(1023), defaultValue: '' } // 驾校描述
});

// 套餐列表
let Pack = sequelize.define('package', {
  school_id: { type: Sequelize.INTEGER }, // 该套餐属于哪个驾校
  pay: { type: Sequelize.INTEGER, defaultValue: 0 }, // 报名费
  title: { type: Sequelize.STRING(255), defaultValue: '' }, // 套餐标题
  price: { type: Sequelize.INTEGER, defaultValue: 0 }, // 该套餐价格，精确到 分
  count: { type: Sequelize.INTEGER, defaultValue: 0}, // 报名人数
  status: { type: Sequelize.INTEGER, defaultValue: 0 }, // 套餐状态
  remark: { type: Sequelize.STRING(1023), defaultValue: '' } // 套餐描述
});

let Plan = sequelize.define('plan', {
  coach_id: Sequelize.INTEGER, //
  type: { type: Sequelize.INTEGER, defaultValue: 2 },
  year: Sequelize.INTEGER, //
  month: Sequelize.INTEGER, //
  date: Sequelize.INTEGER, //
  content: Sequelize.STRING(2047) //
})

// 课程列表
let Course = sequelize.define('course', {
  coach_id: Sequelize.INTEGER, // 属于哪个教练
  stu_id: Sequelize.INTEGER, // 当前课程被哪个学生所选
  type: Sequelize.INTEGER, // 科目二 还是 科目三？
  year: Sequelize.INTEGER, // 年
  month: Sequelize.INTEGER, // 月
  date: Sequelize.INTEGER, // 日
  start: Sequelize.INTEGER, // 开始时间，存 00:00 到当时的分钟数
  end: Sequelize.INTEGER, // 结束时间，存 00:00 到当时的分钟数
  remark: Sequelize.STRING(1023) // 课程备注
});

let Follow = sequelize.define('follow', {
  user_id: Sequelize.INTEGER, // 用户 id
  school_id: Sequelize.INTEGER, // 驾校 id
});

let Info = sequelize.define('info', {
  user_id: Sequelize.INTEGER, // 用户 id
  process: Sequelize.STRING(255), // 学车进度
});

let Label = sequelize.define('label', {
  content: Sequelize.STRING(255),
  type: Sequelize.INTEGER
})

let SchoolLabel = sequelize.define('school_label', {
  label_id: Sequelize.INTEGER, // 标签 id
  user_id: Sequelize.INTEGER, // 评价用户 id
  school_id: Sequelize.INTEGER, // 学校 id
})

let CoachLabel = sequelize.define('coach_label', {
  label_id: Sequelize.INTEGER, // 标签 id
  user_id: Sequelize.INTEGER, // 评评价用户 id
  coach_id: Sequelize.INTEGER, // 学校 id
})


/*

 2880元，普通学员，一费到底，中间不出现任何二次交费（其中不包括体检费20元，拍照费20元），外地学员驾校免费办理暂住证，根据辽宁省交通厅规定，所有学员使用交管12123APP自主预约考试（科目一到科目四），科目二科目三通过“学车么”平台自主预约教练。在线支付200元定金，剩余2680元转由线下支付（报名驾校），线上支付有交易记录，线下支付余款，驾校会开发票。

 3380元，VIP2学员，教练一对一精准教学，保证你通过最难的科目二，让你不用再担心你的科目二，一费到底，中间不出现任何二次交费（其中不包括体检费20元，拍照费20元），外地学员驾校免费办理暂住证，根据辽宁省交通厅规定，所有学员使用交管12123APP自主预约考试（科目一到科目四），科目二科目三通过“学车么”平台自主预约教练。在线支付200元定金，剩余3180元转由线下支付（报名驾校），线上支付有交易记录，线下支付余款，驾校会开发票。

 */

module.exports = {
  User: User,
  Promo: Promo,
  Order: Order,
  Comment: Comment
};