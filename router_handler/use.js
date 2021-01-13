// const { send } = require('process')
const db = require('../db')
const bcrypt = require('bcryptjs')


exports.regUser = (req, res) => {
  const userInfo = req.body
  // 1. 检测是否为空
  if (!userInfo.username || !userInfo.password) {
    /* return res.send({
      status: 1,
      message: '用户名或者密码不能为空!'
    }) */
    return res.cc('用户名或者密码不能为空!')
  }

  // 2.检测用户名是否被占用
  const sql = `select * from ev_user where username=?`
  db.query(sql, [userInfo.username], (err, result) => {
    if (err) {
      //   return res.send({
      //     status: 1,
      //     message: err.message
      //   })
      return res.cc(err.mes)
    }
    if (result.length > 0) {
      /* return res.send({
        status: 1,
        message: '用户名被占用请更换其他的用户名'
      }) */
      return res.cc('用户名被占用请更换其他的用户名')
    }
    // res.send('可以注册')
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)

    const sql = `insert into ev_user set ?`
    db.query(
      sql,
      {
        username: userInfo.username,
        password: userInfo.password
      },
      (err, result) => {
        if (err) {
          /* return res.send({
            status: 1,
            message: err.message
          }) */
          return res.cc(err.message)
        }
        if (result.affectedRows !== 1) {
          /* return res.send({
            status: 1,
            message: '注册用户失败，请稍后重试！'
          }) */
          return res.cc('注册用户失败，请稍后重试！')
        }
        /* res.send({
          status: 0,
          message: '注册成功'
        }) */
        res.cc('注册成功', 0)
      }
    )
  })
}

exports.login = (req, res) => {
  res.send('login ok')
}
