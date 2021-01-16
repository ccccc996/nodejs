const db = require('../db')
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  //   res.send('ok')
  // 定义 sql 语句
  const sql = `select id, username, nickname, email, user_pic from ev_user where id=?`
  db.query(sql, req.user.id, (err, result) => {
    if (err) return res.cc(err)
    if (result.length !== 1) return res.cc('获取用户信息失败')
    res.send({
      status: 0,
      message: '获取用户信息成功',
      data: result[0]
    })
  })
}

exports.updateUserInfo = (req, res) => {
  //   res.send('ok')
  const sql = `update ev_user set ? where id=?`
  db.query(sql, [req.body, req.user.id], (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但影响行数不为 1
    if (result.affectedRows !== 1) return res.cc('修改用户信息失败')
    // 修改用户信息成功
    return res.send('修改用户基本信息成功')
  })
}

exports.updatePassword = (req, res) => {
  //   res.send('ok')
  const sql = `select * from ev_user where id=?`

  db.query(sql, req.user.id, (err, result) => {
    // 执行 sql 语句失败
    if (err) return res.cc(err)

    // 检查指定 ID 用户是否存在
    if (result.length !== 1) return res.cc('用户不存在!')

    // 判断提交的旧密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd, result[0].password)
    if (!compareResult) return res.cc('原密码错误！')

    // 定义更新用户密码的 SQL 语句
    const sql = `update ev_users set password=? where id=?`

    // 对新密码进行 bcrypt 加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

    // 执行 SQL 语句，根据 id 更新用户的密码
    db.query(sql, [newPwd, req.user.id], (err, result) => {
      // SQL 语句执行失败
      if (err) return res.cc(err)

      // SQL 语句执行成功，但是影响行数不等于 1
      if (result.affectedRows !== 1) return res.cc('更新密码失败！')

      // 更新密码成功
      res.cc('更新密码成功！', 0)
    })
  })
}

// 更新用户头像
exports.updateAvatar = (req, res) => {
  const sql = 'update ev_users set user_pic=? where id=?'
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('更新头像失败！')

    // 更新用户头像成功
    return res.cc('更新头像成功！', 0)
  })
}
