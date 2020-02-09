var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var router = require('./router')
var session = require('express-session')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views',path.join(__dirname, './views/')) // 默认从./views目录寻找文件

// 解析表单 POST 请求体插件（要配置在路由器之前！）
// 配置parse application/ json&x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//配置express-session（要配置在路由器之前！）
//通过req.session来访问和设置session成员
//添加session： req.session.foo = 'bar'
//访问session： req.session.foo
app.use(session({
    secret: 'jiamizifu', // 加密字符串，增加安全性用,防止客户端恶意伪造
    resave: false,
    saveUninitialized: true // 无论是否使用session，都会分配一个密匙
}))//Session在生产环境中会永久化储存，服务器关了都不会丢

// 挂在路由到app中
app.use(router)

app.listen(5000,function(){
    console.log('runing..')
})