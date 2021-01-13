// const { send } = require('process')
const db = require('../db')

exports.regUser = (req, res) => {
  const userInfo = req.body
  // 1. 检测是否为空
  if (!userInfo.username || !userInfo.password) {
    return res.send({
      status: 1,
      message: '用户名或者密码不能为空!'
    })
  }

  // 2.检测用户名是否被占用
  const sql = `select * from ev_user where username=?`
  db.query(sql, [userInfo.username], (err, result) => {
    if (err) {
      return res.send({
        status: 1,
        message: err.message
      })
    }
    if (result.length > 0) {
      return res.send({
        status: 1,
        message: '用户名被占用请更换其他的用户名'
      })
    }
    res.send('可以注册')
  })
}

exports.login = (req, res) => {
  res.send('login ok')
}
