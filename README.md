---
noteId: "51d4cfd04d8211ea8b14337a5ae4ac51"
tags: []

---

# Ushelf
- Front End：Bootstrap + AJAX
- Back End：NodeJS + Express
- Web Server：Apache XAMPP
- Database：MySQL

## Directory structure
```
|-- WEB
    |-- app.js
    |-- ERD.vsdx
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
|/|GET| |  |NO|渲染首页*太多了可以直接打开项目看|

## TODO:
- sudo apt-get update
- sudo apt-get install nodejs npm git mysql-server wget
- sudo wget https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/7.4.1/xampp-linux-x64-7.4.1-0-installer.run
- sudo chmod 755 xampp-linux-x64-7.4.1-0-installer.run
- sudo ./xampp-linux-x64-7.4.1-0-installer.run
- cd /opt/lampp/etc/extra
- sudo nano httpd-xampp.conf
- replace "Require local" with "Require all granted"
- sudo service mysql stop
- sudo /opt/lampp/xampp start
- git clone https://github.com/se7ven012/Ushelf.git
- cd Ushelf
- npm install node popper express jquery mysql bootstrap art-template express-art-template body-parser express-session blueimp-md5 moment daterangepicker bootstrap-datepicker nodemailer --save pm2 -g
- node app.js
