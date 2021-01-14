const express = require('express')

const router = express.Router()

const userinfo_handler = require('../router_handler/userinfo')

// 获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户信息
router.post('/userinfo', userinfo_handler.updateUserInfo)

module.exports = router
