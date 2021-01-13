const express = require('express')
const cors = require('cors')
const app = express()

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

app.listen(8008, () => console.log('api server running at http://127.0.0.1:8008'))
