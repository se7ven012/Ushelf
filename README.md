# Ushelf
- Front End：Bootstrap + AJAX
- Back End：NodeJS + Express
- Web Server：Apache XAMPP
- Database：MySQL

## Directory structure
```
|-- Ushelf
    |-- app.js
    |-- README.md
    |-- router.js
    |-- test.sql
    |-- db
    |   |-- DBConfig.js
    |   |-- Usersql.js
    |-- public
    |   |-- css
    |   |   |-- chat.css
    |   |   |-- login.css
    |   |   |-- main.css
    |   |   |-- setting.css
    |   |   |-- ushelf.css
    |   |   |-- ushelf_aboutHost.css
    |   |   |-- ushelf_index.css
    |   |-- img
    |   |   |-- aboutus.jfif
    |   |   |-- avatar-max-img.png
    |   |   |-- banner(original).jpg
    |   |   |-- banner.jpg
    |   |   |-- banner2(original).jpg
    |   |   |-- banner2.jpg
    |   |   |-- banner_signup.jpg
    |   |   |-- banner_signup.jpg~
    |   |   |-- box.jpg
    |   |   |-- brandable-box-8mCsyImZRGY-unsplash.jpg
    |   |   |-- helpdesk(ori).jpg
    |   |   |-- helpdesk.jpg
    |   |   |-- image2.jpg
    |   |   |-- logo.jpeg
    |   |   |-- news_openning.jpg
    |   |   |-- news_referral reward.jpg
    |   |   |-- news_rule.jpg
    |   |   |-- storageA.jfif
    |   |   |-- storageB.jpg
    |   |-- js
    |       |-- chat.js
    |       |-- jquery-3.4.1.min.js
    |       |-- loadFooter.js
    |       |-- loadHostNavbar.js
    |       |-- loadNavbar.js
    |-- views
        |-- 404.html
        |-- forgetPassword.html
        |-- index.html
        |-- login.html
        |-- register.html
        |-- admin
        |   |-- admin-order.html
        |   |-- admin-storage.html
        |   |-- admin-user.html
        |   |-- admin_index.html
        |-- cynthia
        |   |-- abouthost.html
        |   |-- aboutus.html
        |   |-- bookDetails.html
        |   |-- contactus.html
        |   |-- help.html
        |   |-- instruction.html
        |   |-- mystorage-og.html
        |   |-- mystorage-past.html
        |   |-- mystorage-wfc.html
        |   |-- mystorage-wfp.html
        |   |-- mystorage.html
        |   |-- news.html
        |   |-- paymentForm.html
        |   |-- rules.html
        |   |-- rules_host.html
        |   |-- searchStorage.html
        |   |-- storageDetail.html
        |   |-- t&c.html
        |-- host
        |   |-- host-order-ir.html
        |   |-- host-order-past.html
        |   |-- host-order-wfc.html
        |   |-- host-order-wfp.html
        |   |-- host-order.html
        |   |-- host_editListings.html
        |   |-- host_index.html
        |   |-- host_listings.html
        |   |-- host_upload.html
        |   |-- searchStorage.html
        |-- property
        |   |-- chat.html
        |   |-- detail.html
        |   |-- edit.html
        |   |-- new.html
        |   |-- obtainchat.html
        |   |-- search.html
        |   |-- temp
        |-- settings
        |   |-- admin.html
        |   |-- profile.html
        |   |-- settime.html
        |   |-- setting.html
        |-- _layouts
        |   |-- clienthome.html
        |   |-- home.html
        |   |-- hosthome.html
        |-- _partials
            |-- clientheader.html
            |-- footer.html
            |-- hostheader.html
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
- npm install node popper express jquery mysql bootstrap art-template express-art-template body-parser express-session blueimp-md5 moment daterangepicker bootstrap-datepicker nodemailer mddir pm2 -g
- pm2 start app.js
- pm2 logs
