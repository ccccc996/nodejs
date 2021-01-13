// 引入 express
const express = require('express')

const cros = require('cors')
// 创建服务器对象
const app = express()
// 解决跨域问题
app.use(cros)
// 配置解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: fasle }))
app.use(express.json())
// TODO:

// 监听端口
app.listen(998, () => console.log('Server running on http://localhost:998'))
