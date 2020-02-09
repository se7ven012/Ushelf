const mysql = require('mysql');

function getConnection(){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "", //leave it blank when using xxampp
        database: "comments",
        connectionLimit:25 //连接数量限制
    });

    return con;
}

module.exports.getConnection = getConnection;