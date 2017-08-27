const model = require('./model');


model.User.sync({force: true}).then(() => {
  model.User.create({
    openid: 'o8rEnwPLHZzg5Ig-Y_3SDDhSUFT8',
    nickname: '凌乱',
    ssid: 'ssid',
    timeout: Date.now() + 7200 * 1000
  });
});

model.Promo.sync({force: true}).then(() => {
  model.Promo.create({
    code: 'momakeji',
    power: 8000,
    times: 1,
    user_id: 0
  });
});

model.Order.sync({force: true})
model.Comment.sync({force: true});

/**
model.Student.sync({ force: true }).then(() => {
  model.Student.create({
    user_id: 1,
    school_id: 1,
    process: 2
  })
})

model.Coach.sync({ force: true }).then(() => {
  model.Coach.create({
    user_id: 2,
    school_id: 1,
    bannerimg_list: '',
    score: 4.5,
  })
})

// */

/*
model.School.sync({force: true}).then(() => {
  model.School.create({
    name: '银河驾校',
    address: '沈阳',
    headimgurl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1076299015,3978806350&fm=23&gp=0.jpg',
    bannerimg_list: '[http://img0.imgtn.bdimg.com/it/u=1348040250,3494357728&fm=23&gp=0.jpg]',
    remark: '银河驾校沈阳航空航天大学'
  });
});


model.Pack.sync({force: true}).then(() => {
  model.Pack.create({
    school_id: 1,
    pay: 20000,
    title: '银河 2880 套餐',
    price: 288800,
    count: 0,
    status: 1,
    remark: '2880元，普通学员，一费到底，中间不出现任何二次交费（其中不包括体检费20元，拍照费20元），外地学员驾校免费办理暂住证，根据辽宁省交通厅规定，所有学员使用交管12123APP自主预约考试（科目一到科目四），科目二科目三通过“学车么”平台自主预约教练。在线支付200元定金，剩余2680元转由线下支付（报名驾校），线上支付有交易记录，线下支付余款，驾校会开发票。'
  })
  model.Pack.create({
    school_id: 1,
    pay: 20000,
    title: '银河 3380 套餐',
    price: 338800,
    count: 0,
    status: 1,
    remark: '3380元，VIP2学员，教练一对一精准教学，保证你通过最难的科目二，让你不用再担心你的科目二，一费到底，中间不出现任何二次交费（其中不包括体检费20元，拍照费20元），外地学员驾校免费办理暂住证，根据辽宁省交通厅规定，所有学员使用交管12123APP自主预约考试（科目一到科目四），科目二科目三通过“学车么”平台自主预约教练。在线支付200元定金，剩余3180元转由线下支付（报名驾校），线上支付有交易记录，线下支付余款，驾校会开发票。'
  })
});

model.Label.sync({force: true}).then(() => {
  model.Label.create({
    content: '下证快',
    type: 1
  })
  model.Label.create({
    content: '服务好',
    type: 1
  })
  model.Label.create({
    content: '服务好',
    type: 2
  })
  model.Label.create({
    content: '有耐心',
    type: 2
  })
  model.Label.create({
    content: '文明道德',
    type: 2
  })
})

model.SchoolLabel.sync({force: true}).then(() => {
  model.SchoolLabel.create({
    label_id: 1,
    user_id: 1,
    school_id: 1
  })
  model.SchoolLabel.create({
    label_id: 2,
    user_id: 1,
    school_id: 1
  })
  model.SchoolLabel.create({
    label_id: 2,
    user_id: 2,
    school_id: 1
  })
})

model.CoachLabel.sync({force: true}).then(() => {
  model.CoachLabel.create({
    label_id: 3,
    user_id: 1,
    school_id: 1
  })
  model.CoachLabel.create({
    label_id: 4,
    user_id: 1,
    school_id: 1
  })
})

model.Order.sync({force: true});

model.Plan.sync({force: true});


model.Plan.sync({force: true})

model.Course.sync({force: true});


model.Follow.sync({force: true});


model.Info.sync({force: true});
*/