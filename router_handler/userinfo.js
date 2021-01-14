const db = require('../db')

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
