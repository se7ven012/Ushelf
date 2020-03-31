var UserSQL = {
    insertUser: 'INSERT INTO user(email,password,username) VALUES(?,?,?)', // 刷入新用户
    updateDateforOrder: 'UPDATE user SET startdate = ?, enddate= ? WHERE email = ?',
    updateUnavailableDates: 'UPDATE user SET unavailabledates = ? WHERE email = ?',
    getUnavailableDates: 'SELECT unavailabledates FROM user WHERE email = ?',
    drop: 'DROP TABLE user', // 删除表中所有的数据
    queryAll: 'SELECT * FROM user', // 查找表中所有数据
    getUserById: 'SELECT * FROM user WHERE email =?', // 查找符合条件的数据
    insertmsg: 'INSERT INTO chats(fromsb,saytosb,publishTime,content) VALUES(?,?,?,?)', // 刷入聊天记录
    getmsg: '(SELECT * FROM chats WHERE fromsb=? AND saytosb=?) UNION (SELECT * FROM chats WHERE fromsb=? AND saytosb=?) ORDER BY publishTime',
    resetpassword: 'UPDATE user SET password = ? WHERE email = ?',
    insertStorage: 'INSERT INTO storage (id, owner, price, title, type, size, address0, address1, city, province, zipcode, country, dedicated, conditions, paragraph, feature, image, mention, prohibited) VALUES (? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?)',
    updateStorage: 'UPDATE storage SET price=?, title=?, type=?, size=?, address0=?, address1=?, city=?, province=?, zipcode=?, country=?, dedicated=?, conditions=?, paragraph=?, feature=?, image=?, mention=?, prohibited=? WHERE id=?',
    searchStorage: 'SELECT * FROM storage WHERE type = ? AND size = ?', //查找合适的搜索结果
    getStorageDetail: 'SELECT * FROM storage WHERE id = ?', // 点开product
    insertOrder: 'INSERT INTO orders (orderid, storageid, customer, confirm, startdate, enddate, length, baseprice, servicefee, totalprice, personaltitle, firstname, lastname, request, paid, ended, reviewed) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', // 刷入新storage
    insertPayment: 'INSERT INTO payment (id,orderid,price) VALUES (?,?,?)', // 刷入新storage
    updateOrderPaymentStatus: 'UPDATE orders SET paid = ? WHERE orderid = ?', // 支付成功后改order状态
    searchOrderOfWFC: 'SELECT * FROM orders AS o, storage AS s WHERE o.storageid = s.id AND o.confirm = "no" AND o.customer = ?', // 找所有等待host确认的订单
    searchOrderOfWFP: 'SELECT * FROM orders AS o, storage AS s WHERE o.storageid = s.id AND o.confirm = "yes" AND o.paid = "no" AND o.customer= ? ', // 找所有等待付款订单
    searchOrderOfOG: 'SELECT * FROM orders AS o, storage AS s WHERE o.storageid = s.id AND o.confirm = "yes" AND o.paid = "yes" AND o.ended = "no" AND o.customer= ? ', // 找所有正在进行的订单
    searchOrderOfPast: 'SELECT * FROM orders AS o, storage AS s WHERE o.storageid = s.id AND o.ended = "yes" AND o.customer= ? ', // 找所有历史订单
    getOrderByID: 'SELECT * FROM orders AS o, storage AS s WHERE o.storageid = s.id AND o.confirm = "no" AND o.orderid = ?', // 点开order
    searchHostOrderofWFC: 'SELECT * FROM storage AS s, orders AS o WHERE s.id = o.storageid AND o.confirm = "no" AND s.owner = ? ',
    searchHostOrderofWFP: 'SELECT * FROM storage AS s, orders AS o WHERE s.id = o.storageid AND o.confirm = "yes" AND o.paid = "no" AND s.owner = ?',
    searchHostOrderofIR: 'SELECT * FROM storage AS s, orders AS o WHERE s.id = o.storageid AND o.confirm = "yes" AND o.paid = "yes" AND o.ended = "no" AND s.owner = ?',
    searchHostOrderofPast: 'SELECT * FROM storage AS s, orders AS o WHERE s.id = o.storageid AND o.ended = "yes" AND s.owner = ? ',
    acceptOrder: 'UPDATE orders SET confirm = "yes" WHERE orderid = ?',
    rejectOrder: 'UPDATE orders SET confirm = "reject" WHERE orderid = ?',
    insertReview: 'INSERT INTO review (reviewid, orderid, writer, content) VALUES (?, ?, ?, ?)',
    reviewOrder: 'UPDATE orders SET reviewed = "yes" WHERE orderid = ?',
    selectReview: 'SELECT * FROM review WHERE writer = ?',
    selectReviewbyid: 'SELECT s.id, r.writer, r.content FROM storage AS s, review AS r, orders AS o WHERE o.orderid = r.orderid AND o.storageid = s.id AND s.id = ?',
    getOrderbyOrderid: 'SELECT * FROM orders WHERE orderid = ?',
    searchStoragebyOwner: 'SELECT * FROM storage WHERE owner = ?',
    removeStorage: 'DELETE FROM storage WHERE id=?',
    changeUsername: 'UPDATE user SET username=? WHERE email=?',
    getUser: 'SELECT * FROM user',
    getOrder: 'SELECT * FROM orders',
    getStorage: 'SELECT * FROM storage',

}
module.exports = UserSQL;