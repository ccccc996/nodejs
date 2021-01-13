// const { send } = require('process')
const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

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
  // 1. 校验用户信息
  const userInfo = req.body
  // 2. 查询此用户名是否存在
  const sql = `select * from ev_user where username=?`

  db.query(sql, userInfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1
    if (results.length !== 1) return res.cc('登录失败！')
    // 这里只是简单的判断了用户名 数据库里有数据的话就会成功
    // res.send('ok')

    // 3. 查询到了此用户，就比对密码
    // TODO：判断用户输入的登录密码是否和数据库中的密码一致
    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)

    // 如果对比的结果等于 false, 则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc('登录失败！')
    }

    // TODO：登录成功，生成 Token 字符串
    // 4. 密码正确，生成 token
    const user = { ...results[0], password: '', user_pic: '' }
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' })

    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr
    })
  })
}
