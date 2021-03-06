var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('./db/DBConfig');
var userSQL = require('./db/Usersql');
var md5 = require('blueimp-md5');
var moment = require('moment');
var nodemailer = require('nodemailer');

// --------------------配置----------------------
// 使用DBConfig.js的配置信息创建一个MySql链接池
var pool = mysql.createPool(dbConfig.mysql);
// 配置nodemailer
var mailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth: {
        user: 'se7ven011@gmail.com',
        pass: 'mzy66666'
    },
});
// 响应一个JSON数据
var responseJSON = function(res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '-200',
            msg: '错误值'
        });
    } else {
        res.json(ret);
    }
};
// --------------------配置----------------------

router.get('/', function(req, res) {
    //console.log(req.session.user)
    res.render('index.html', {
        user: req.session.user
    })
})
router.get('/signin', function(req, res) {
    res.render('login.html')
})
router.post('/signin', function(req, res) {
    //1.获取表单数据
    //2.操作数据库查询
    //3.发送响应
    pool.getConnection(function(err, connection) {
        // 获取前台页面传过来的参数
        var param = JSON.parse(JSON.stringify(req.body));
        var account = param.account;
        console.log(account)
        var password = md5(md5(param.password));
        if (account == "admin@ushelf.com") {
            var password = param.password
            console.log("Is admin")
        }
        var _res = res;
        var data = {};
        connection.query(userSQL.queryAll, function(err, res, result) {
            if (res) { //获取用户列表，循环遍历判断当前用户是否存在
                var found = false;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].email == account && res[i].password == password) {
                        found = true;
                        data.userInfo = {};
                        data.userInfo.username = res[i].username;
                        data.userInfo.account = account;
                        data.userInfo.password = password;
                        data.result = {
                            code: 200,
                            msg: 'Password correct!'
                        };
                        //console.log('Password correct!')
                        req.session.user = data.userInfo;
                    }
                }
                if (found == false) {
                    data.result = {
                        code: 1,
                        msg: 'Wrong password or does not exist!'
                    };
                }
            }
            if (err) data.err = err;
            // 以json形式，把操作结果返回给前台页面
            setTimeout(function() {
                responseJSON(_res, data)
            }, 300);
            // 释放链接
            connection.release();
        });
    });
})
router.get('/signup', function(req, res) {
        res.render('register.html')
    }) // 注册账号，加载页面
router.post('/signup.check', function(req, res) {
        // 查看是否存在该账号，然后发验证码
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = JSON.parse(JSON.stringify(req.body));
            var account = param.account;
            var _res = res;
            // console.log(param);
            connection.query(userSQL.queryAll, function(err, res) {
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
                    };
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                    connection.release();
                } else {
                    var validationnum = "";
                    for (var i = 0; i < 6; i++) {
                        validationnum += Math.floor(Math.random() * 10);
                    }
                    // 配置信件
                    var emailcontent = {
                        from: '"Ushelf Team" <se7ven011@gmail.com>',
                        to: '<' + account + '>',
                        subject: 'Sign Up',
                        text: 'This is your validation number: ' + validationnum
                    };
                    // 发送信件
                    mailTransport.sendMail(emailcontent, function(err, msg) {
                        console.log('开始发邮件');
                        if (err) {
                            console.log(err);
                            data.result = {
                                error: err,
                                code: 2,
                                msg: '邮件发送失败'
                            };
                        } else {
                            console.log('邮件发送成功');
                            data.result = {
                                validationcode: validationnum,
                                code: 200,
                                msg: 'Validation code has been sent'
                            };
                        }
                        setTimeout(function() {
                            responseJSON(_res, data)
                        }, 300);
                        connection.release();
                    });
                }
                if (err) data.err = err;
            });
        });
    }) // 注册账号，检查账号是否存在并发送验证码
router.post('/signup.verify', function(req, res) {
        // 注册过程输入验证码后直接执行的命令
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = JSON.parse(JSON.stringify(req.body));
            var account = param.account;
            var username = param.username;
            var password = md5(md5(param.password[0]));
            var _res = res;
            var data = {};
            connection.query(userSQL.insertUser, [account, password, username], function(err, result) {
                if (result) {
                    data.result = {
                        code: 200,
                        msg: '注册成功'
                    };
                } else {
                    data.result = {
                        code: -1,
                        msg: '注册失败'
                    };
                }
                // 发送成功，结果返回给前台页面
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 注册账号，创建账号
router.get('/logout', function(req, res) {
    // 1.清除登陆状态
    // 2.重新定向到主页
    req.session.user = null
    res.redirect('/')
})
router.get('/profile', function(req, res) {
    res.render('settings/profile.html', {
        user: req.session.user
    })
})
router.get('/aboutus', function(req, res) {
    res.render('cynthia/aboutus.html', {
        user: req.session.user
    })
})
router.get('/news', function(req, res) {
    res.render('cynthia/news.html', {
        user: req.session.user
    })
})
router.get('/instruction', function(req, res) {
    res.render('cynthia/instruction.html', {
        user: req.session.user
    })
})
router.get('/rules', function(req, res) {
    res.render('cynthia/rules.html', {
        user: req.session.user
    })
})
router.get('/contactus', function(req, res) {
    res.render('cynthia/contactus.html', {
        user: req.session.user
    })
})
router.get('/t&c', function(req, res) {
    res.render('cynthia/t&c.html', {
        user: req.session.user
    })
})
router.get('/help', function(req, res) {
    res.render('cynthia/help.html', {
        user: req.session.user
    })
})
router.get('/abouthost', function(req, res) {
    res.render('cynthia/abouthost.html', {
        user: req.session.user
    })
})
router.get('/rules_host', function(req, res) {
    res.render('cynthia/rules_host.html', {
        user: req.session.user
    })
})
router.get('/searchStorage.search', function(req, res) {
        res.render('cynthia/searchStorage.html', {
            user: req.session.user
        })
    }) // 搜索storage信息，第一次加载search页面，注销掉session
router.post('/searchStorage.search', function(req, res) {
    pool.getConnection(function(err, connection) {
        console.log("searchstorage.search")
        var param = JSON.parse(JSON.stringify(req.body));
        var _res = res;
        var data = {};
        var contentlist = [];
        connection.query(userSQL.getStorage, function(err, res) {
            if (res) {
                console.log(res.length)
                    // 获取用户发的聊天记录
                if (res.length > 30) {
                    for (i = 0; i < 30; i++) {
                        var content = {};
                        content = (res[i]);
                        contentlist.push(content);
                    }
                } else {
                    for (i = 0; i < res.length; i++) {
                        var content = {};
                        content = (res[i]);
                        contentlist.push(content);
                    }
                }
                data.result = {
                    info: contentlist,
                    code: 200,
                    msg: '搜索结果获取成功'
                };
                req.session.searchresult = contentlist;
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            } else {
                data.result = {
                    code: -1,
                    msg: '搜索结果获取失败'
                };
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            }
            if (err) {
                data.err = err;
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            }
            connection.release();
        });
    });
})
router.get('/searchStorage.result', function(req, res) {
        res.render('cynthia/searchStorage.html', {
            user: req.session.user,
            searchresult: req.session.searchresult
        })
    }) // 搜索storage信息，读取session并显示搜索结果
router.post('/searchStorage.json', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var contentlist = [];
            connection.query(userSQL.searchStorage, [param.type, param.size], function(err, res) {
                if (res) {
                    // 获取用户发的聊天记录
                    for (i = 0; i < res.length; i++) {
                        var content = {};
                        content = (res[i]);
                        contentlist.push(content);
                    }
                    data.result = {
                        info: contentlist,
                        code: 200,
                        msg: '搜索结果获取成功'
                    };
                    req.session.searchresult = contentlist;
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                } else {
                    data.result = {
                        code: -1,
                        msg: '搜索结果获取失败'
                    };
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                }
                if (err) {
                    data.err = err;
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                }
                connection.release();
            });
        });
    }) // 搜索storage信息，获取信息并存入session
router.post('/clickproduct.json', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var storageDetail = [];
            connection.query(userSQL.getStorageDetail, [param.id], function(err, res) {
                if (res) {
                    // 获取用户发的聊天记录
                    for (i = 0; i < res.length; i++) {
                        var content = {};
                        content = (res[i]);
                        storageDetail.push(content);
                    }
                    data.result = {
                        info: storageDetail,
                        code: 200,
                        msg: '搜索结果获取成功'
                    };
                    req.session.storageDetail = storageDetail;
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                } else {
                    data.result = {
                        code: -1,
                        msg: '搜索结果获取失败'
                    };
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                }
                if (err) {
                    data.err = err;
                }
                connection.release();
            });
        });
    }) // 获取特定storage信息，获取信息并存入session
router.get('/storageDetail', function(req, res) {
        res.render('cynthia/storageDetail.html', {
            detailinfo: req.session.storageDetail,
            user: req.session.user,
            reviewList: req.session.reviewList
        })
    }) // 获取特定storage信息，加载页面，读取session并显示信息
router.post('/storageDetail', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var orderDetail = [];
            var content = {};
            content = param;
            orderDetail.push(content);
            req.session.orderinfo = orderDetail;
            data.result = {
                code: 200,
                msg: '修改成功'
            };
            setTimeout(function() {
                responseJSON(_res, data)
            }, 300);
            connection.release();
        });
    }) // 获取特定storage信息，把order信息保存在session
router.get('/bookDetails', function(req, res) {
        res.render('cynthia/bookDetails.html', {
            orderinfo: req.session.orderinfo,
            user: req.session.user
        })
    }) // 下订单，加载页面和session
router.post('/bookDetails', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            console.log(param)
            var _res = res;
            var data = {};
            var confirm = "no";
            var id = ""; //伪随机数，部署的时候要换成primary number
            for (var i = 0; i < 19; i++) {
                id += Math.floor(Math.random() * 10);
            }
            connection.query(userSQL.insertOrder, [id, param.storageid, param.customer, confirm, param.startdate, param.enddate, param.length, param.baseprice, param.servicefee, param.totalprice, param.title, param.firstname, param.lastname, param.request, "no", "no", "no"], function(err, res) {
                if (res) {
                    console.log('成功')
                    data.result = {
                        code: 200,
                        msg: '搜索结果获取成功'
                    };

                } else {
                    console.log('失败')
                    data.result = {
                        code: -1,
                        msg: '搜索结果获取失败'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 下订单，刷入DB
router.get('/paymentForm', function(req, res) {
        res.render('cynthia/paymentForm.html', {
            user: req.session.user,
            userorderdetail: req.session.userorderdetail
        })
    }) // 付款，加载页面和session
router.post('/clickpayment.json', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var orderDetail = [];
            connection.query(userSQL.getOrderbyOrderid, [param.id], function(err, res) {
                if (res) {
                    // 获取用户发的聊天记录
                    for (i = 0; i < res.length; i++) {
                        var content = {
                            orderid: res[i].orderid,
                            storageid: res[i].storageid,
                            customer: res[i].storageid,
                            startdate: moment(res[i].startdate).format('YYYY-MM-DD'),
                            enddate: moment(res[i].enddate).format('YYYY-MM-DD'),
                            totalprice: res[i].totalprice,
                            length: res[i].length,
                        };
                        orderDetail.push(content);
                    }
                    data.result = {
                        code: 200,
                        msg: '搜索结果获取成功'
                    };
                    req.session.userorderdetail = orderDetail;
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                } else {
                    data.result = {
                        code: -1,
                        msg: '搜索结果获取失败'
                    };
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                }
                if (err) {
                    data.err = err;
                }
                connection.release();
            });
        });
    }) // Get specific order information 
router.post('/paymentForm', function(req, res) {
        pool.getConnection(function(err, connection) {
            console.log("paymentForm")
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var id = ""; //伪随机数，部署的时候要换成primary number
            for (var i = 0; i < 19; i++) {
                id += Math.floor(Math.random() * 10);
            }
            var orderid = param.orderid;
            var price = param.price;
            var time = new Date();
            console.log(param)
            connection.query(userSQL.insertPayment, [id, orderid, price], function(err, result) {
                console.log("AAAAAAAAAA")
                var data = {};
                if (result) {
                    var status = "yes";
                    var paided = "yes";
                    console.log("BBBBB")
                    connection.query(userSQL.updateOrderPaymentStatus, [paided, orderid], function(err, res) {
                        console.log(res)
                        if (res) {
                            data.result = {
                                code: 200,
                                msg: '付款成功,order状态已修改'
                            };
                        } else {
                            data.result = {
                                code: -1,
                                msg: '付款成功,order状态修改失败'
                            };
                        }
                        if (err) data.err = err;
                        setTimeout(function() {
                            responseJSON(_res, data)
                        }, 300);
                    });
                } else {
                    data.result = {
                        code: -1,
                        msg: 'payment上传失败'
                    };
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                }
                if (err) data.err = err;
            });
            connection.release();
        });
    }) // 付款，读取session并显示，刷进DB，并修改order的paid状态
router.get('/host_index', function(req, res) {
    res.render('host/host_index.html', {
        user: req.session.user
    })
})
router.get('/host_upload', function(req, res) {
        res.render('host/host_upload.html', {
            user: req.session.user
        })
    }) // 上传storage，加载页面
router.post('/host_upload', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var id = ""; //伪随机数，部署的时候要换成primary number
            for (var i = 0; i < 9; i++) {
                id += Math.floor(Math.random() * 10);
            }
            var price = param.price;
            var title = param.title;
            var size = param.size;
            var type = param.type;
            var address0 = param.address0;
            var address1 = param.address1;
            var city = param.city;
            var province = param.province;
            var zipcode = param.zipcode;
            var country = param.country;
            var dedicated = param.dedicated;
            var conditionMax6 = param.conditionMax6;
            var condition = "";
            for (var i = 0; i < conditionMax6.length; i++) {
                condition += conditionMax6[i];
            }
            var paragraph = param.paragraph;
            var featureMax5 = param.featureMax5;
            var feature = "";
            if (featureMax5 != null) {
                for (var i = 0; i < featureMax5.length; i++) {
                    feature += featureMax5[i];
                }
            } else {
                feature = 9;
            }
            var image = 'picture';
            var mention = param.mention;
            var prohibitedMax5 = param.prohibitedMax5;
            var prohibited = "";
            if (prohibitedMax5 != null) {
                for (var i = 0; i < prohibitedMax5.length; i++) {
                    prohibited += prohibitedMax5[i];
                }
            } else {
                prohibited = 9;
            }
            connection.query(userSQL.insertStorage, [id, req.session.user.account, price, title, type, size, address0, address1, city, province, zipcode, country, dedicated, condition, paragraph, feature, image, mention, prohibited], function(err, result) {
                var data = {};
                if (result) {
                    data.result = {
                        code: 200,
                        msg: 'storage上传成功'
                    };
                } else {
                    data.result = {
                        code: -1,
                        msg: 'storage上传失败'
                    };
                }
                if (err) data.err = err;
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            });
            connection.release();
        });
    }) // 上传storage，刷入DB
router.get('/host_uploadPricing', function(req, res) {
    res.render('host/host_uploadPricing.html', {
        user: req.session.user
    })
})
router.get('/host_uploadCalendar', function(req, res) {
    res.render('host/host_uploadCalendar.html', {
        user: req.session.user
    })
})
router.get('/host_listings', function(req, res) {
    res.render('host/host_listings.html', {
        user: req.session.user,
        hostlistings: req.session.hostlistings
    })
})
router.post('/host_listings', function(req, res) {
    pool.getConnection(function(err, connection) {
        var param = JSON.parse(JSON.stringify(req.body));
        var _res = res;
        var data = {};
        var contentlist = [];
        connection.query(userSQL.searchStoragebyOwner, [param.customer], function(err, res) {
            if (res) { // 找到wfc的情况
                if (res[0] == null) {
                    console.log('没有搜索结果')
                    data.result = {
                        code: 1,
                        msg: '没有搜索结果'
                    }
                } else {
                    for (p = 0; p < res.length; p++) {
                        var content = {};
                        content = res[p]
                        contentlist.push(content);
                    }
                    req.session.hostlistings = contentlist;
                    data.result = {
                        code: 200,
                        msg: '搜索结果获取成功'
                    };
                }
            } else {
                data.result = {
                    code: 1,
                    msg: '没有搜索结果'
                };
            }
            if (err) {
                data.err = err;
            }
            setTimeout(function() {
                responseJSON(_res, data)
            }, 300);
            connection.release();
        });
    });
})
router.get('/forgetPassword', function(req, res) {
        res.render('forgetPassword.html')
    }) // 忘记密码，加载页面
router.post('/forgetPassword.check', function(req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = JSON.parse(JSON.stringify(req.body));
            var account = param.email;
            var _res = res;
            connection.query(userSQL.queryAll, function(err, res) {
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
                    // 生成6位随机数
                    var validationnum = "";
                    for (var i = 0; i < 6; i++) {
                        validationnum += Math.floor(Math.random() * 10);
                    }
                    // 配置信件
                    var emailcontent = {
                        from: '"Ushelf Team" <se7ven011@gmail.com>',
                        to: '<' + account + '>',
                        // to          : '<272286222@qq.com>, <c3315951@uon.edu.au>',
                        // cc         : ''  //抄送
                        // bcc      : ''    //密送
                        subject: 'Find you password',
                        text: 'This is your validation number to reset your password: ' + validationnum,
                        // html           : '<h1>你好，这是一封来自NodeMailer的邮件！</h1><p><img src="cid:00000001"/></p>',
                        // attachments : 
                        //             [
                        //                 {
                        //                     filename: 'img1.png',            // 改成你的附件名
                        //                     path: 'public/images/img1.png',  // 改成你的附件路径
                        //                     cid : '00000001'                 // cid可被邮件使用
                        //                 },
                        //                 {
                        //                     filename: 'img2.png',            // 改成你的附件名
                        //                     path: 'public/images/img2.png',  // 改成你的附件路径
                        //                     cid : '00000002'                 // cid可被邮件使用
                        //                 },
                        //             ]
                    };
                    // 发送信件
                    mailTransport.sendMail(emailcontent, function(err, msg) {
                        if (err) data.err = err;
                        else {
                            data.result = {
                                emailaccount: account,
                                validationcode: validationnum,
                                code: 200,
                                msg: 'Validation code has been sent'
                            };
                        }
                        setTimeout(function() {
                            responseJSON(_res, data)
                        }, 300);
                        connection.release();
                    });
                } else {
                    data.result = {
                        code: 1,
                        msg: 'Cannot find the user'
                    };
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                    connection.release();
                }
                if (err) data.err = err;
            });
        });
    }) // 忘记密码，检查账号是否存在并发送验证码
router.post('/forgetPassword.verify', function(req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = JSON.parse(JSON.stringify(req.body));
            var account = param.newpassword1;
            var password = md5(md5(param.newpassword2));
            var _res = res;
            console.log(param);
            var data = {};
            connection.query(userSQL.resetpassword, [password, account], function(err, result) {
                if (result) {
                    data.result = {
                        code: 200,
                        msg: '修改成功'
                    };
                } else {
                    data.result = {
                        code: 1,
                        msg: '修改失败'
                    };
                }
                if (err) data.err = err;
                // 发送成功，结果返回给前台页面
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 忘记密码，重置密码
router.get('/mystorage', function(req, res) {
        res.render('cynthia/mystorage.html', {
            user: req.session.user
        })
    }) // 搜索orders, 加载界面
router.get('/mystorage-wfc', function(req, res) {
        res.render('cynthia/mystorage-wfc.html', {
            wfc: req.session.wfc,
            user: req.session.user,
        })
    }) // 搜索order that wait for confirm，加载页面和session
router.post('/mystorage-wfc.load', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var contentlist = [];
            console.log('wfc')
            connection.query(userSQL.searchOrderOfWFC, [param.customer], function(err, res) {
                if (res) { // 找到wfc的情况
                    if (res[0] == null) {
                        console.log('没有搜索结果')
                        req.session.wfc = null;
                        data.result = {
                            code: 1,
                            msg: '没有搜索结果'
                        }
                    } else {
                        for (p = 0; p < res.length; p++) {
                            var content = {
                                id: res[p].id,
                                orderid: res[p].orderid,
                                startdate: moment(res[p].startdate).format('YYYY-MM-DD'),
                                enddate: moment(res[p].enddate).format('YYYY-MM-DD'),
                                price: res[p].totalprice,
                                title: res[p].title,
                                owner: res[p].owner,
                                address0: res[p].address0,
                                address1: res[p].address1,
                                city: res[p].city,
                                province: res[p].province,
                                zipcode: res[p].zipcode,
                                type: res[p].type,
                                size: res[p].size,
                                dedicated: res[p].dedicated,
                                feature: res[p].feature,
                                prohibited: res[p].prohibited
                            };
                            contentlist.push(content);
                        }
                        req.session.wfc = contentlist;
                        data.result = {
                            code: 200,
                            msg: '搜索结果获取成功'
                        };
                    }
                } else {
                    data.result = {
                        code: 1,
                        msg: '没有搜索结果'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 搜索order that wait for confirm，获取信息并存入session
router.get('/mystorage-wfp', function(req, res) {
        res.render('cynthia/mystorage-wfp.html', {
            wfp: req.session.wfp,
            user: req.session.user
        })
    }) // 搜索order that wait for payment，加载页面和session
router.post('/mystorage-wfp.load', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var contentlist = [];
            console.log('wfp')
            connection.query(userSQL.searchOrderOfWFP, [param.customer], function(err, res) {
                if (res) { // 找到wfc的情况
                    if (res[0] == null) {
                        console.log('没有搜索结果')
                        req.session.wfp = null
                        data.result = {
                            code: 1,
                            msg: '没有搜索结果'
                        }
                    } else {
                        for (p = 0; p < res.length; p++) {
                            var content = {
                                id: res[p].id,
                                orderid: res[p].orderid,
                                startdate: moment(res[p].startdate).format('YYYY-MM-DD'),
                                enddate: moment(res[p].enddate).format('YYYY-MM-DD'),
                                price: res[p].totalprice,
                                title: res[p].title,
                                owner: res[p].owner,
                                address0: res[p].address0,
                                address1: res[p].address1,
                                city: res[p].city,
                                province: res[p].province,
                                zipcode: res[p].zipcode,
                                type: res[p].type,
                                size: res[p].size,
                                dedicated: res[p].dedicated,
                                feature: res[p].feature,
                                prohibited: res[p].prohibited
                            };
                            contentlist.push(content);
                        }
                        req.session.wfp = contentlist;
                        data.result = {
                            code: 200,
                            msg: '搜索结果获取成功'
                        };
                    }
                } else {
                    data.result = {
                        code: 1,
                        msg: '没有搜索结果'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 搜索order that wait for payment，获取信息并存入session
router.get('/mystorage-og', function(req, res) {
        res.render('cynthia/mystorage-og.html', {
            og: req.session.og,
            user: req.session.user
        })
    }) // 搜索order that confirmed，加载页面和session
router.post('/mystorage-og.load', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var contentlist = [];
            console.log('og')
            connection.query(userSQL.searchOrderOfOG, [param.customer], function(err, res) {
                if (res) { // 找到wfc的情况
                    if (res[0] == null) {
                        console.log('没有搜索结果')
                        req.session.og = null
                        data.result = {
                            code: 1,
                            msg: '没有搜索结果'
                        }
                    } else {
                        for (p = 0; p < res.length; p++) {
                            var content = {
                                id: res[p].id,
                                orderid: res[p].orderid,
                                startdate: moment(res[p].startdate).format('YYYY-MM-DD'),
                                enddate: moment(res[p].enddate).format('YYYY-MM-DD'),
                                price: res[p].totalprice,
                                title: res[p].title,
                                owner: res[p].owner,
                                address0: res[p].address0,
                                address1: res[p].address1,
                                city: res[p].city,
                                province: res[p].province,
                                zipcode: res[p].zipcode,
                                type: res[p].type,
                                size: res[p].size,
                                dedicated: res[p].dedicated,
                                feature: res[p].feature,
                                prohibited: res[p].prohibited
                            };
                            contentlist.push(content);
                        }
                        req.session.og = contentlist;
                        data.result = {
                            code: 200,
                            msg: '搜索结果获取成功'
                        };
                    }
                } else {
                    console.log('没有搜索结果')
                    data.result = {
                        code: 1,
                        msg: '没有搜索结果'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 搜索order that confirmed，加载页面和session
router.get('/mystorage-past', function(req, res) {
        res.render('cynthia/mystorage-past.html', {
            past: req.session.past,
            user: req.session.user
        })
    }) // 搜索history order，获取信息并存入session
router.post('/mystorage-past.load', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var contentlist = [];
            console.log('past')
            connection.query(userSQL.searchOrderOfPast, [param.customer], function(err, res) {
                if (res) { // 找到wfc的情况
                    if (res[0] == null) {
                        console.log('没有搜索结果')
                        req.session.past = null
                        data.result = {
                            code: 1,
                            msg: '没有搜索结果'
                        }
                    } else {
                        for (p = 0; p < res.length; p++) {
                            var content = {
                                id: res[p].id,
                                orderid: res[p].orderid,
                                startdate: moment(res[p].startdate).format('YYYY-MM-DD'),
                                enddate: moment(res[p].enddate).format('YYYY-MM-DD'),
                                price: res[p].totalprice,
                                title: res[p].title,
                                owner: res[p].owner,
                                address0: res[p].address0,
                                address1: res[p].address1,
                                city: res[p].city,
                                province: res[p].province,
                                zipcode: res[p].zipcode,
                                type: res[p].type,
                                size: res[p].size,
                                dedicated: res[p].dedicated,
                                feature: res[p].feature,
                                prohibited: res[p].prohibited
                            };
                            contentlist.push(content);
                        }
                        req.session.past = contentlist;
                        data.result = {
                            code: 200,
                            msg: '搜索结果获取成功'
                        };
                    }
                } else {
                    data.result = {
                        code: 1,
                        msg: '没有搜索结果'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 搜索history order，加载页面和session
router.post('/submitReview', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var id = ""; //伪随机数，部署的时候要换成primary number
            for (var i = 0; i < 19; i++) {
                id += Math.floor(Math.random() * 10);
            }
            connection.query(userSQL.insertReview, [id, param.orderId, param.customer, param.content], function(err, res) {
                if (res) { // 找到wfc的情况
                    connection.query(userSQL.reviewOrder, [param.orderId], function(err, result) {
                        if (result) {
                            data.result = {
                                code: 200,
                                msg: '成功修改order'
                            };
                        } else {
                            data.result = {
                                code: 1,
                                msg: '修改order失败'
                            };
                        }
                        if (err) {
                            data.err = err;
                        }
                    });
                } else {
                    data.result = {
                        code: 1,
                        msg: '没有搜索结果'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 提交Review，刷入DB
router.get('/clickorder', function(req, res) {
        res.render('/.html', {
            orderDetail: req.session.orderDetail,
            user: req.session.user
        })
    }) // 获取特定order信息，加载页面和session
router.post('/clickorder.json', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var orderDetail = [];
            connection.query(userSQL.getOrderByID, [param.orderid], function(err, res) {
                if (res) {
                    var content = {};
                    content = (res);
                    console.log(content);
                    orderDetail.push(content);
                    data.result = {
                        code: 200,
                        msg: '搜索结果获取成功'
                    };
                    req.session.orderDetail = orderDetail;
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                } else {
                    data.result = {
                        code: -1,
                        msg: '搜索结果获取失败'
                    };
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                }
                if (err) {
                    data.err = err;
                }
                connection.release();
            });
        });
    }) // 获取特定order信息，获取信息并存入session
router.get('/host-order', function(req, res) {
    res.render('host/host-order.html', {
        user: req.session.user,
    })
})
router.get('/host-order-wfc', function(req, res) {
        res.render('host/host-order-wfc.html', {
            user: req.session.user,
            hostwfc: req.session.hostwfc
        })
    }) // 搜索order that wait for confirm，加载页面和session
router.post('/host-wfc.load', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var contentlist = [];
            console.log('wfc-host')
            connection.query(userSQL.searchHostOrderofWFC, [param.customer], function(err, res) {
                if (res) { // 找到wfc的情况
                    console.log(res.length)
                    if (res[0] == null) {
                        console.log('没有搜索结果')
                        req.session.hostwfc = null;
                        data.result = {
                            code: 1,
                            msg: '没有搜索结果'
                        }
                    } else {
                        for (p = 0; p < res.length; p++) {
                            var content = {
                                id: res[p].id,
                                orderid: res[p].orderid,
                                startdate: moment(res[p].startdate).format('YYYY-MM-DD'),
                                enddate: moment(res[p].enddate).format('YYYY-MM-DD'),
                                customer: res[p].customer,
                                price: res[p].totalprice,
                                title: res[p].title,
                                owner: res[p].owner,
                                address0: res[p].address0,
                                address1: res[p].address1,
                                city: res[p].city,
                                province: res[p].province,
                                zipcode: res[p].zipcode,
                                type: res[p].type,
                                size: res[p].size,
                                dedicated: res[p].dedicated,
                                feature: res[p].feature,
                                prohibited: res[p].prohibited,
                                request: res[p].request
                            };
                            contentlist.push(content);
                        }
                        req.session.hostwfc = contentlist;
                        data.result = {
                            code: 200,
                            msg: '搜索结果获取成功'
                        };
                    }
                } else {
                    data.result = {
                        code: 1,
                        msg: '没有搜索结果'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 搜索order that wait for confirm,获取信息并存入session
router.get('/host-order-wfp', function(req, res) {
        res.render('host/host-order-wfp.html', {
            user: req.session.user,
            hostwfp: req.session.hostwfp
        })
    }) // 搜索order that wait for payment，加载页面和session
router.post('/host-wfp.load', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var contentlist = [];
            console.log('wfp-host')
            connection.query(userSQL.searchHostOrderofWFP, [param.customer], function(err, res) {
                if (res) { // 找到wfc的情况
                    console.log(res.length)
                    if (res[0] == null) {
                        console.log('没有搜索结果')
                        req.session.hostwfp = null;
                        data.result = {
                            code: 1,
                            msg: '没有搜索结果'
                        }
                    } else {
                        for (p = 0; p < res.length; p++) {
                            var content = {
                                id: res[p].id,
                                orderid: res[p].orderid,
                                startdate: moment(res[p].startdate).format('YYYY-MM-DD'),
                                enddate: moment(res[p].enddate).format('YYYY-MM-DD'),
                                customer: res[p].customer,
                                price: res[p].totalprice,
                                title: res[p].title,
                                owner: res[p].owner,
                                address0: res[p].address0,
                                address1: res[p].address1,
                                city: res[p].city,
                                province: res[p].province,
                                zipcode: res[p].zipcode,
                                type: res[p].type,
                                size: res[p].size,
                                dedicated: res[p].dedicated,
                                feature: res[p].feature,
                                prohibited: res[p].prohibited,
                                request: res[p].request
                            };
                            contentlist.push(content);
                        }
                        req.session.hostwfp = contentlist;
                        data.result = {
                            code: 200,
                            msg: '搜索结果获取成功'
                        };
                    }
                } else {
                    data.result = {
                        code: 1,
                        msg: '没有搜索结果'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 搜索order that wait for payment，获取信息并存入session
router.get('/host-order-ir', function(req, res) {
        res.render('host/host-order-ir.html', {
            user: req.session.user,
            hostir: req.session.hostir
        })
    }) // 搜索order that confirmed，加载页面和session
router.post('/host-ir.load', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var contentlist = [];
            console.log('ir-host')
            connection.query(userSQL.searchHostOrderofIR, [param.customer], function(err, res) {
                if (res) { // 找到wfc的情况
                    console.log(res.length)
                    if (res[0] == null) {
                        console.log('没有搜索结果')
                        req.session.hostir = null;
                        data.result = {
                            code: 1,
                            msg: '没有搜索结果'
                        }
                    } else {
                        for (p = 0; p < res.length; p++) {
                            var content = {
                                talker: res[p].customer,
                                id: res[p].id,
                                orderid: res[p].orderid,
                                startdate: moment(res[p].startdate).format('YYYY-MM-DD'),
                                enddate: moment(res[p].enddate).format('YYYY-MM-DD'),
                                customer: res[p].customer,
                                price: res[p].totalprice,
                                title: res[p].title,
                                owner: res[p].owner,
                                address0: res[p].address0,
                                address1: res[p].address1,
                                city: res[p].city,
                                province: res[p].province,
                                zipcode: res[p].zipcode,
                                type: res[p].type,
                                size: res[p].size,
                                dedicated: res[p].dedicated,
                                feature: res[p].feature,
                                prohibited: res[p].prohibited,
                                request: res[p].request
                            };
                            contentlist.push(content);
                        }
                        req.session.hostir = contentlist;
                        data.result = {
                            code: 200,
                            msg: '搜索结果获取成功'
                        };
                    }
                } else {
                    data.result = {
                        code: 1,
                        msg: '没有搜索结果'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 搜索order that confirmed，获取信息并存入session
router.get('/host-order-past', function(req, res) {
        res.render('host/host-order-past.html', {
            user: req.session.user,
            hostpast: req.session.hostpast
        })
    }) // 搜索history order，加载页面和session
router.post('/host-past.load', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var contentlist = [];
            console.log('past-host')
            connection.query(userSQL.searchHostOrderofPast, [param.customer], function(err, res) {
                if (res) { // 找到wfc的情况
                    console.log(res.length)
                    if (res[0] == null) {
                        console.log('没有搜索结果')
                        req.session.hostpast = null;
                        data.result = {
                            code: 1,
                            msg: '没有搜索结果'
                        }
                    } else {
                        for (p = 0; p < res.length; p++) {
                            var content = {
                                id: res[p].id,
                                orderid: res[p].orderid,
                                startdate: moment(res[p].startdate).format('YYYY-MM-DD'),
                                enddate: moment(res[p].enddate).format('YYYY-MM-DD'),
                                price: res[p].totalprice,
                                customer: res[p].customer,
                                title: res[p].title,
                                owner: res[p].owner,
                                address0: res[p].address0,
                                address1: res[p].address1,
                                city: res[p].city,
                                province: res[p].province,
                                zipcode: res[p].zipcode,
                                type: res[p].type,
                                size: res[p].size,
                                dedicated: res[p].dedicated,
                                feature: res[p].feature,
                                prohibited: res[p].prohibited,
                                request: res[p].request
                            };
                            contentlist.push(content);
                        }
                        req.session.hostpast = contentlist;
                        data.result = {
                            code: 200,
                            msg: '搜索结果获取成功'
                        };
                    }
                } else {
                    data.result = {
                        code: 1,
                        msg: '没有搜索结果'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // 搜索history order，获取信息并存入session
router.post('/acceptorder.json', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            console.log(param.orderid)
            connection.query(userSQL.acceptOrder, [param.orderid], function(err, res) {
                if (res) {
                    console.log('成功')
                    data.result = {
                        code: 200,
                        msg: '修改order成功'
                    };

                } else {
                    console.log('失败')
                    data.result = {
                        code: -1,
                        msg: '修改order失败'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // host接受订单，修改order的confirm
router.post('/rejectorder.json', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            console.log(param.orderid)
            connection.query(userSQL.rejectOrder, [param.orderid], function(err, res) {
                if (res) {
                    console.log('成功')
                    data.result = {
                        code: 200,
                        msg: '修改order成功'
                    };

                } else {
                    console.log('失败')
                    data.result = {
                        code: -1,
                        msg: '修改order失败'
                    };
                }
                if (err) {
                    data.err = err;
                }
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
                connection.release();
            });
        });
    }) // host接受订单，修改order的confirm
router.get('/editListings', function(req, res) {
        res.render('host/host_editListings.html', {
            user: req.session.user,
            storageDetail: req.session.storageDetail
        })
    }) // 上传storage，加载页面
router.post('/editListings', function(req, res) {
    pool.getConnection(function(err, connection) {
        var param = JSON.parse(JSON.stringify(req.body));
        var _res = res;
        var data = {};
        var contentlist = [];
        connection.query(userSQL.getStorageDetail, [param.id], function(err, res) {
            if (res) {
                // 获取用户发的聊天记录
                for (i = 0; i < res.length; i++) {
                    var content = {};
                    content = (res[i]);
                    contentlist.push(content);
                }
                data.result = {
                    code: 200,
                    msg: '搜索结果获取成功'
                };
                req.session.storageDetail = contentlist;
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            } else {
                data.result = {
                    code: -1,
                    msg: '搜索结果获取失败'
                };
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            }
            if (err) {
                data.err = err;
            }
            connection.release();
        });
    });
})
router.post('/editListings.upload', function(req, res) {
    pool.getConnection(function(err, connection) {
        console.log("editListingsUpload")
        var param = JSON.parse(JSON.stringify(req.body));
        var _res = res;
        var storageid = param.storageid
        var price = param.price;
        var title = param.title;
        var size = param.size;
        var type = param.type;
        var address0 = param.address0;
        var address1 = param.address1;
        var city = param.city;
        var province = param.province;
        var zipcode = param.zipcode;
        var country = param.country;
        var dedicated = param.dedicated;
        var condition = param.conditionMax6;
        var paragraph = param.paragraph;
        var featureMax5 = param.featureMax5;
        var feature = "";
        if (featureMax5 != null) {
            for (var i = 0; i < featureMax5.length; i++) {
                feature += featureMax5[i];
            }
        } else {
            feature = 9;
        }
        var image = 'picture';
        var mention = param.mention;
        var prohibitedMax5 = param.prohibitedMax5;
        var prohibited = "";
        if (prohibitedMax5 != null) {
            for (var i = 0; i < prohibitedMax5.length; i++) {
                prohibited += prohibitedMax5[i];
            }
        } else {
            prohibited = 9;
        }
        connection.query(userSQL.updateStorage, [price, title, type, size, address0, address1, city, province, zipcode, country, dedicated, condition, paragraph, feature, image, mention, prohibited, storageid], function(err, result) {
            var data = {};
            if (result) {
                data.result = {
                    code: 200,
                    msg: 'storage上传成功'
                };
            } else {
                data.result = {
                    code: -1,
                    msg: 'storage上传失败'
                };
            }
            if (err) data.err = err;
            setTimeout(function() {
                responseJSON(_res, data)
            }, 300);
        });
        connection.release();
    });
})
router.post('/removeStorage', function(req, res) {
    pool.getConnection(function(err, connection) {
        var param = JSON.parse(JSON.stringify(req.body));
        console.log(param);
        console.log("removestorage")
        var _res = res;
        var data = {};
        connection.query(userSQL.removeStorage, [param.id], function(err, res) {
            if (res) {
                // 获取用户发的聊天记录
                /*for (i = 0; i < res.length; i++) {
                    var content = {};
                    content = (res[i]);
                    contentlist.push(content);
                }
                data.result = {
                    code: 200,
                    msg: '搜索结果获取成功'
                };
                req.session.storageDetail = contentlist;*/
                data.result = {
                    code: 200,
                    msg: 'Remove successful'
                };
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            } else {
                data.result = {
                    code: -1,
                    msg: 'Fail to remove'
                };
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            }
            if (err) {
                data.err = err;
            }
            connection.release();
        });
    });
})
router.post('/changeUsername', function(req, res) {
    pool.getConnection(function(err, connection) {
        var param = JSON.parse(JSON.stringify(req.body));
        console.log(param);
        console.log("changeusername")
        var _res = res;
        var data = {};
        var name = param.username;
        var email = param.email;
        var contentlist = [];
        connection.query(userSQL.changeUsername, [name, email], function(err, res) {
            console.log(res)
            if (res) {
                data.result = {
                    code: 200,
                    msg: 'Update'
                };
                req.session.user.username = name;
                console.log(req.session.user.username)
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            } else {
                data.result = {
                    code: -1,
                    msg: 'Fail'
                };
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            }
            if (err) {
                data.err = err;
            }
            connection.release();
        });
    });
})
router.get('/message', function(req, res) {
        res.render('property/chat.html', {
            user: req.session.user,
            content: req.session.content,
            saytosb: req.session.saytosb
        })
    }) // 聊天功能测试，4.正式加载页面与聊天记录
router.get('/obtainchatmsg', function(req, res) {
        res.render('property/chat.html', {
            user: req.session.user,
            content: req.session.content,
            saytosb: req.session.saytosb
        })
    }) // 聊天功能测试，2.预缓冲聊天记录
router.post('/getchatmsg.json', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var saytosb = param.saytosb;
            var data = {};
            var contentlist = []
            var test = {}
            test.fromsb = (req.session.user.account);
            test.time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            test.msg = "Start to talk now";
            contentlist.push(test)
            connection.query(userSQL.getmsg, [saytosb, req.session.user.account, req.session.user.account, saytosb], function(error, result) {
                if (result) {
                    for (i = 0; i < result.length; i++) {
                        var content = {};
                        content.fromsb = (result[i].fromsb);
                        content.time = (moment(result[i].publishTime).format('YYYY-MM-DD HH:mm:ss'));
                        content.msg = (result[i].content);
                        contentlist.push(content)
                    } // console.log(contentlist)
                    data.result = {
                        code: 200,
                        msg: '聊天记录读取成功'
                    };
                    req.session.content = contentlist;
                    // 发送至前端
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                    connection.release();
                } else {
                    data.result = {
                        code: -1,
                        msg: '获取对象聊天记录失败'
                    };
                    connection.release();
                }
                if (error) {
                    data.error = error;
                    connection.release();
                }
            });
        });
    }) // 聊天功能，3.加载聊天记录并塞入session
router.post('/getchatmsg.session', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            req.session.saytosb = param.chater;
            data.result = {
                code: 200,
                msg: '聊天对象设置session成功'
            };
            setTimeout(function() {
                responseJSON(_res, data)
            }, 300);
        })
    }) // 聊天功能，1.把对方的名字加入session
router.post('/postmsg', function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            fromsb = req.session.user.account;
            saytosb = param.saytosb;
            publishedTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            content = param.content;
            var data = {};
            connection.query(userSQL.insertmsg, [fromsb, saytosb, publishedTime, content], function(err, result) {
                if (result) {
                    data.result = {
                        code: 200,
                        msg: '消息发送成功'
                    };
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                } else {
                    data.result = {
                        code: -1,
                        msg: '消息发送失败'
                    };
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                }
            });
            connection.release();
        });
    }) // 聊天功能，发送消息
router.get('/admin', function(req, res) {
    res.render('admin/admin_index.html', {
        user: req.session.user,
        userList: req.session.userlist
    })
})
router.get('/admin-user', function(req, res) {
    res.render('admin/admin-user.html', {
        user: req.session.user,
        userList: req.session.userlist
    })
})
router.post('/admin-user', function(req, res) {
    pool.getConnection(function(err, connection) {
        var _res = res;
        var data = {};
        contentlist = [];
        connection.query(userSQL.getUser, function(err, res, result) {
            if (res) {
                // 获取用户发的聊天记录
                for (i = 0; i < res.length; i++) {
                    var content = {};
                    content = (res[i]);
                    contentlist.push(content);
                }
                data.result = {
                    info: contentlist,
                    code: 200,
                    msg: '搜索结果获取成功'
                };
                req.session.userlist = contentlist;
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            } else {
                data.result = {
                    code: -1,
                    msg: '搜索结果获取失败'
                };
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            }
            connection.release();
        });
    });
})
router.get('/admin-order', function(req, res) {
    res.render('admin/admin-order.html', {
        user: req.session.user,
        orderList: req.session.orderList
    })
})
router.post('/admin-order', function(req, res) {
    pool.getConnection(function(err, connection) {
        console.log("adminorder")
        var _res = res;
        var data = {};
        contentlist = [];
        connection.query(userSQL.getOrder, function(err, res, result) {
            if (res) {
                // 获取用户发的聊天记录
                for (i = 0; i < res.length; i++) {
                    var content = {};
                    content = (res[i]);
                    contentlist.push(content);
                }
                data.result = {
                    info: contentlist,
                    code: 200,
                    msg: '搜索结果获取成功'
                };
                req.session.orderList = contentlist;
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            } else {
                data.result = {
                    code: -1,
                    msg: '搜索结果获取失败'
                };
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            }
            connection.release();
        });
    });
})
router.get('/admin-storage', function(req, res) {
    res.render('admin/admin-storage.html', {
        user: req.session.user,
        storageList: req.session.storageList
    })
})
router.post('/admin-storage', function(req, res) {
    pool.getConnection(function(err, connection) {
        console.log("adminstorage")
        var _res = res;
        var data = {};
        contentlist = [];
        connection.query(userSQL.getStorage, function(err, res, result) {
            if (res) {
                // 获取用户发的聊天记录
                for (i = 0; i < res.length; i++) {
                    var content = {};
                    content = (res[i]);
                    contentlist.push(content);
                }
                data.result = {
                    info: contentlist,
                    code: 200,
                    msg: '搜索结果获取成功'
                };
                req.session.storageList = contentlist;
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            } else {
                data.result = {
                    code: -1,
                    msg: '搜索结果获取失败'
                };
                setTimeout(function() {
                    responseJSON(_res, data)
                }, 300);
            }
            connection.release();
        });
    });
})
router.post('/loadReview', function(req, res) {
        pool.getConnection(function(err, connection) {
            console.log("loadReview")
            var param = JSON.parse(JSON.stringify(req.body));
            var _res = res;
            var data = {};
            var contentList = [];
            req.session.reviewList = null;
            connection.query(userSQL.selectReviewbyid, [param.id], function(err, res) {
                if (res) {
                    if (res.length > 3) {
                        for (i = 0; i < 3; i++) {
                            var content = {};
                            content = (res[i]);
                            contentList.push(content);
                        }
                    } else {
                        for (i = 0; i < res.length; i++) {
                            var content = {};
                            content = (res[i]);
                            contentList.push(content);
                        }
                    }
                    data.result = {
                        code: 200,
                        msg: '搜索结果获取成功'
                    };
                    req.session.reviewList = contentList;
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                } else {
                    data.result = {
                        code: -1,
                        msg: '搜索结果获取失败'
                    };
                    setTimeout(function() {
                        responseJSON(_res, data)
                    }, 300);
                }
                if (err) {
                    data.err = err;
                }
                connection.release();
            });
        });
    }) // 获取特定storage信息，获取信息并存入session
module.exports = router