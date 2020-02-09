var express = require('express')
var router = express.Router()
var mysql = require('mysql');
var dbConfig = require('./db/DBConfig');
var userSQL = require('./db/Usersql');
var md5 = require('blueimp-md5')


// 使用DBConfig.js的配置信息创建一个MySql链接池
var pool = mysql.createPool(dbConfig.mysql);

// 响应一个JSON数据
var responseJSON = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '-200',
            msg: '错误值'
        });
    } else {
        res.json(ret);
    }
};

router.get('/', function (req, res) {
    //console.log(req.session.user)
    res.render('index.html',{
        user: req.session.user
    })
})

router.get('/signin', function (req, res) {
    res.render('login.html')
})

router.post('/signin', function (req, res) {
    //1.获取表单数据
    //2.操作数据库查询
    //3.发送响应
    pool.getConnection(function (err, connection) {
        // 获取前台页面传过来的参数
        var param = JSON.parse(JSON.stringify(req.body));
        var account = param.account;
        var password = md5(md5(param.password));
        var _res = res;
        //console.log(param)
        connection.query(userSQL.queryAll, function (err, res, result) {
            if (res) { //获取用户列表，循环遍历判断当前用户是否存在
                var found = false;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].email == account && res[i].password == password) {
                        found = true;
                        var data = {};
                        data.userInfo = {};
                        data.userInfo.account = account;
                        data.userInfo.password = password;
                        result = {
                            code: 200,
                            msg: 'Password correct!'
                        };
                        //console.log('Password correct!')
                        data.result = result;
                        req.session.user = data.userInfo;
                    }
                }
                if (found == false){
                    result = {
                        code: -1,
                        msg: 'Wrong password!'
                    };
                    console.log('Wrong password!')
                }
            }
            if (err) data.err = err;
            // 以json形式，把操作结果返回给前台页面
            responseJSON(_res, data);
            // 释放链接
            connection.release();
        });
    });
})

router.get('/signup', function (req, res) {
    res.render('register.html')
})

router.post('/signup', function (req, res) {
    //1.获取表单数据
    //2.操作数据库查询
    //3.刷入值/发送响应
    pool.getConnection(function (err, connection) {
        // 获取前台页面传过来的参数
        var param = JSON.parse(JSON.stringify(req.body));
        var account = param.account;
        var password = md5(md5(param.password));
        var _res = res;
        //console.log(account)
        connection.query(userSQL.queryAll, function (err, res) {
            var isTrue = false;
            if (res) { //获取用户列表，循环遍历判断当前用户是否存在
                for (var i = 0; i < res.length; i++) {
                    if (res[i].email == account) {
                        isTrue = true;
                    }
                }
            }
            var data = {};
            data.isreg = !isTrue; //如果isTrue布尔值为true则登陆成功 有false则失败
            if (isTrue) {
                data.result = {
                    code: 1,
                    msg: '用户已存在'
                }; //登录成功返回用户信息
                console.log('用户已存在');
            } else {
                connection.query(userSQL.insert, [account, password], function (err, result) {
                    if (result) {
                        data.result = {
                            code: 200,
                            msg: '注册成功'
                        };
                        //用session记录用户的登陆状态
                        req.session.user = result
                        //console.log('注册成功');
                    } else {
                        data.result = {
                            code: -1,
                            msg: '注册失败'
                        };
                        //console.log('注册失败');
                    }
                });
            }
            if (err) data.err = err;
            // 以json形式，把操作结果返回给前台页面
            setTimeout(function () {
                responseJSON(_res, data)
            }, 300);
            // responseJSON(_res, data);
            // 释放链接
            connection.release();
        });
    });
})

router.get('/logout', function (req, res) {
    // 1.清除登陆状态
    // 2.重新定向到主页
    req.session.user = null
    res.redirect('/')
})

module.exports = router