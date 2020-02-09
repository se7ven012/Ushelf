const http = require('http');
const fs = require('fs');
const con = require("./DBConnection");

// '127.0.0.1'表明只有本机可访问，'0.0.0.0'表示所有人可访问
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.method == 'GET' && req.url == '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream('./index.html').pipe(res);
    } else if (req.method == 'GET' && req.url == '/login') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream('./login.html').pipe(res);
    } else if (req.method == 'GET' && req.url == '/styles/customStyles.css') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        fs.createReadStream('./styles/customStyles.css').pipe(res);
    } else if (req.method == 'GET' && req.url == '/function.js') {
        res.writeHead(200, {
            "Content-Type": "text/javascript"
        });
        fs.createReadStream("./function.js").pipe(res);
    }
    //用来获取前端收到的 框框内的字符， 拿到后在这里刷进数据库。
    else if (req.method == 'POST' && req.url == '/insert') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        var conn = con.getConnection(); //call function from another file
        var content = '';

        req.on('data', function (data) {
            content += data;

0
            var obj = JSON.parse(content);
            console.log("The user name is: " + obj.name);
            console.log("The comment is: " + obj.message);

            var insertcomments = "INSERT INTO comments.comments (comments.username, comments.comment) VALUES (?,?) ";
            conn.query(insertcomments, [obj.name, obj.message], function (err, result, fields) {
                if (err) throw err;
                console.log("Success!");
            });
            conn.end()
            res.end("Successfully inserted!")
        });
    } else if (req.method == 'POST' && req.url == '/signup') {
        res.statusCode = 200;
        //设定获取数据的类型
        res.setHeader('Content-Type', 'text/plain');
        var conn = con.getConnection(); //call function from another file
        var content = '';

        req.on('data', function (data) {
            content += data;

            var obj = JSON.parse(content);
            console.log("The account is: " + obj.account);
            console.log("The password is: " + obj.password);

            var findaccount = "SELECT * FROM test.user WHERE user.email LIKE " + "'" + obj.account + "'";
            var insertaccount = "INSERT INTO test.user (user.email, user.password) VALUES (?,?) ";
            conn.query(findaccount, function (err, result, fields) {
                if (err) throw err;
                if (result.length) {
                    console.log("Account exist!")
                } else {
                    conn.query(insertaccount, [obj.account, obj.password], function (err, result, fields) {
                        if (err) throw err;
                        console.log("Successfully inserted!")
                    });
                    conn.end()
                }
            });
            conn.end()
            res.end()
        });
    } else if (req.method == 'POST' && req.url == '/signin') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        var conn = con.getConnection();
        var content = '';
        req.on('data', function (data) {
            content += data;
            var obj = JSON.parse(content);
          +-le.log("Searching for account: " + obj.account);

            var findaccount = "SELECT * FROM test.user WHERE user.email LIKE " + "'" + obj.account + "'";
            conn.query(findaccount, function (err, result, fields) {
                if (err) throw err;
                if (result.length) {
                    console.log('------start-------');
                    var string = JSON.stringify(result);
                    var json = JSON.parse(string)[0];
                    console.log(string);
                    var temp = "";
                    if (json.password == obj.password) {
                        console.log('Password verified!');
                        res.render
                        //res.setHeader('Content-type','text/html');
                        //temp = '<script>alert("登录成功!"); window.location.href="/";</script>';
                        //res.end(temp);
                    } else {
                        console.log('Wrong password!');
                    }
                    console.log('-------end--------');
                } else {
                    console.log('Account does not exist');
                }
            });
            conn.end()
            res.end()
        });
    } else if (req.method == 'GET' && req.url == '/home') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        var conn = con.getConnection(); //call function from another file
        var checkcomments = "SELECT * FROM comments.comments";

        conn.query(checkcomments, function (err, result, fields) {
            if (err) throw err;
            // result.forEach((comment)=>{
            //     console.log(comment);//直接读table 里的 atrri/ 用Table,XXX
            // });
            var comments = JSON.stringify(result);
            res.end(comments);
        });
        conn.end();
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream('./404.html').pipe(res);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});