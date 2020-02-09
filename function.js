function loadComments() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //这行代码用来刷新comments tag(把新的数据加载老数据后面，不用全部刷新)
            document.getElementById('comments').innerHTML = '';

            var result = this.responseText;
            var results = JSON.parse(result);

            results.forEach((comment) => {

                //？？？？定义格式？
                var node = document.createElement("div");
                var name = document.createElement("H5");
                var date = document.createElement("H6");
                var message = document.createElement("P");

                //？？？？定义具体的框框？
                node.className = 'card-body';
                name.className = 'card-title';
                date.className = 'card-subtitle text-muted';

                //获取数据
                var textName = document.createTextNode('Name: ' + comment.userName);
                var textDate = document.createTextNode('Date: ' + comment.date);
                var textMessage = document.createTextNode(comment.comment);

                //把数据加在框框里
                name.appendChild(textName);
                date.appendChild(textDate);
                message.appendChild(textMessage);

                //数据要加进body才行
                node.appendChild(name);
                node.appendChild(date);
                node.appendChild(message);

                //append all to the <div> tag
                document.getElementById('comments').appendChild(node);
            });
        }
    }

    xhttp.open("GET", "/home", true);
    xhttp.send();
}

//这里的逻辑是先从bootstrap把框框里的字符取出来发给node处理
function insertComment() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        //TODO: code response display the new comment into the comment section
        if (this.readyState == 4 && this.status == 200) {
            var result = this.responseText;
            //这里的console是在前端显示的, result从后端来
            console.log(result);
            //强制刷新网页
            loadComments();
        }
    }
    var name = document.getElementById('name').value; //'name is from html(input id="name")'
    var message = document.getElementById('message').value;

    xhttp.open("POST", "/insert", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"name":"' + name + '", "message":"' + message + '"}');
}

//注册 **在这里写字符限制，不能出现空字符，要邮箱格式
function SignUpAccount() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        //TODO: code response display the new comment into the comment section
        if (this.readyState == 4 && this.status == 200) {
            var result = this.responseText;
            console.log(result); //控制台看命令状态
        }
    }
    //获取相应框框内的值
    var account = document.getElementById('account').value;
    var password = document.getElementById('password').value;

    if (account != "" || password != "") {
        //发送一个状态个server.js判断
        xhttp.open("POST", "/signup", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        //发送取得的值给server.js
        xhttp.send('{"account":"' + account + '", "password":"' + password + '"}');
    }
}

//登录
function SignInAccount() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        //TODO: code response display the new comment into the comment section
        if (this.readyState == 4 && this.status == 200) {
            var result = this.responseText;
            console.log(result); //控制台看命令状态
        }
    }
    //获取相应框框内的值
    var account = document.getElementById('account').value;
    var password = document.getElementById('password').value;

    if (account != "" || password != "") {
        //发送一个状态个server.js判断
        xhttp.open("POST", "/signin", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        //发送取得的值给server.js
        xhttp.send('{"account":"' + account + '", "password":"' + password + '"}');
    }
}