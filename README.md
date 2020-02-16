# Ushelf
NodeJS + Express + MySQL + Bootstrap

## Directory structure
```
|-- WEB
    |-- app.js
    |-- function.js
    |-- package-lock.json
    |-- README.md
    |-- router.js
    |-- .notebook
    |   |-- assets
    |   |   |-- images
    |   |-- tmp
    |       |-- .gitignore
    |       |-- drawIOAppForChrome.html
    |       |-- chrome
    |-- db
    |   |-- DBConfig.js
    |   |-- Usersql.js
    |-- public
    |   |-- css
    |   |   |-- login.css
    |   |   |-- main.css
    |   |   |-- setting.css
    |   |-- img
    |   |   |-- avatar-max-img.png
    |   |-- js
    |-- router
    |   |-- property.js
    |   |-- session.js
    |-- views
        |-- 404.html
        |-- index.html
        |-- login.html
        |-- register.html
        |-- property
        |   |-- detail.html
        |   |-- edit.html
        |   |-- new.html
        |   |-- search.html
        |-- settings
        |   |-- admin.html
        |   |-- profile.html
        |   |-- setting.html
        |-- _layouts
        |   |-- home.html
        |-- _partials
            |-- footer.html
            |-- header.html
            |-- settings-nav.html
```

## Router
|PATH|GET/POST|GET ATTRIBUTES|POST ATTRIBUTES|REQUIRED LOGIN|备注|
| :----: | :----: | :----: | :----: | :----: | :---- |
|/|GET| |  |NO|渲染首页| 			 	
|/signup|GET| | |NO|渲染注册页|
|/signup|POST| |email, password|NO|处理注册请求|
|/signin|GET||  |NO|渲染登录页|
|/signin|POST|| email, password|NO|处理登录请求|
|/logout|GET| | |YES|处理退出请求|
|/detail|GET| | |YES|渲染用户预定日期界面|
|/detail.json|GET|unavailabledates| |YES|渲染用户预定日期界面|
|/detail|POST|| |YES|处理预定日期请求|
|/setting|GET| | |YES|渲染用户设定日期界面|
|/setting|POST| | |YES|处理设定日期请求|

## Ubuntu TODO:
- sudo apt-get install nodejs npm git mysql-server wget
- sudo wget https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/7.4.1/xampp-linux-x64-7.4.1-0-installer.run
- sudo chmod 755 xampp-linux-x64-7.4.1-0-installer.run
- sudo ./xampp-linux-x64-7.4.1-0-installer.run
- cd /opt/lampp/etc/extra
- sudo nano httpd-xampp.conf
- replace "Require local" with "Require all granted"
- service mysql stop
- sudo /opt/lampp/lampp start
- git clone https://github.com/se7ven012/Ushelf.git
- cd Ushelf
- npm install node express mysql bootstrap jquery art-template express-art-template --save body-parser express-session blueimp-md5 moment daterangepicker bootstrap-datepicker
- node app.js

## Windows TODO:
- 安装 nodejs git mysql
- 下载 xampp
- 关掉 mysql后台服务
- 启动 xampp （勾选mysql和apache选项）
- 用git clone把这个项目复制到本地
- 用vscode打开项目文件夹
- 在vscode的console里执行： npm install node express mysql bootstrap jquery art-template express-art-template --save body-parser express-session blueimp-md5 moment daterangepicker bootstrap-datepicker
- 在vscode的console里执行： node app.js
