const express = require('express')
const cors = require('cors')
const app = express()
const expressJWT = require('express-jwt')
const config = require('./config')

// #1 解决跨域问题
app.use(cors())

// #2 配置解析 application/x-www-form-urlencoded 格式 以及 json 格式的表单数据
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// #3 统一响应，优化 res.send
app.use(require('./middleware/optimizeSend'))

// #4 解析 token
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// #5 自己设置的接口
app.use('/api', require('./router/use'))
app.use('/my', require('./router/userinfo'))
// 导入并使用文章分类路由模块
app.use('/my/article', require('./router/artcate'))

// #6 错误中间件
app.use(require('./middleware/errHandler'))

app.listen(8008, () => console.log('api server running at http://127.0.0.1:8008'))
