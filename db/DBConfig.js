module.exports = {
    mysql: {
        host: '0.0.0.0', // '127.0.0.1'表明只有本机可访问，'0.0.0.0'表示所有人可访问
        user: 'root', //你的数据库账号
        password: '', //用xxamp的时候不用密码
        database: 'test',//你的数据库名
        connectionLimit: 25
    }
}
