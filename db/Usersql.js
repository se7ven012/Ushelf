var UserSQL = {
    insertUser: 'INSERT INTO user(email,password) VALUES(?,?)', // 刷入新用户
    updateDateforOrder: 'UPDATE user SET startdate = ?, enddate= ? WHERE email = ?',
    updateUnavailableDates: 'UPDATE user SET unavailabledates = ? WHERE email = ?',
    getUnavailableDates:'SELECT unavailabledates FROM user WHERE email = ?',
    drop: 'DROP TABLE user', // 删除表中所有的数据
    queryAll: 'SELECT * FROM user', // 查找表中所有数据
    getUserById: 'SELECT * FROM user WHERE email =?', // 查找符合条件的数据
};

module.exports = UserSQL;