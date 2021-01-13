const express = require('express')
const cors = require('cors')
const app = express()
const joi = require('@hapi/joi')

// 解决跨域问题
app.use(cors())
// 配置解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))
// 配置解析 json 格式的表单数据
app.use(express.json())

app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

const userRouter = require('./router/use')
app.use('/api', userRouter)

// 错误中间件
app.use((err, req, res, next) => {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 未知错误
  res.cc(err)
})

app.listen(8008, () => console.log('api server running at http://127.0.0.1:8008'))
