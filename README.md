# AI-referigerator
a simple of MUI list application for refrigerator management.

## 安装&运行
``` javascript
  cd server
  npm install
  cd lib
  node main.js
```
打开 `ref.html`,就可以使用了
## 结构
### 前端
* css
  * icon.extra.css
  * mescroll.css
  * mui.css
  * mui.picker.css
  * ref.css
* fonts
  * mui.ttf
  * mui-icons-extra.ttf
* img
  * referigerator.png
* js
  * mescroll.js
  * mui.min.js
  * mui.picker.js
  * ref.js
* ref.html
### 后端
* lib
  * create.js
  * delete.js
  * init.js
  * main.js
  * modify.js
  * option.js
* node_moudules
  * relevant node moudules
* built.json
* option.json
* cargo.json
## 配置
### 服务器 配置
``` javascript
  cd server
  vi built.json
```
!你也可以使用 `vim built.json` 命令.
* `port`: 服务器监视的端口.
* `option`: 配置文件地址.
* `cargo`: 物品文件地址.

### 总览 配置
``` javascript
  cd server
  vi option.json
```
!你也可以使用 `vim built.json` 命令.
* `general`: 总览配置.
  * `version`: 应用版本.
  * `title`: 应用标题.
  * `showVoid`: 控制是否显示空的类别.
  * `language`: 控制显示的语言(开发中).
  * `night_mode`: 夜间模式(开发中).
* `warns`: 数量预警设置.
  * `show`: 显示数量预警设置.
  * `level`: 数量预警级别.
  * `brandary`: 每级预警边界值.

## 功能
* 物品数量管理
* 类别分类
* 数量预警功能
* ...

## Run
``` javascript
  cd server
  npm install
  cd lib
  node main.js
```
then open ref.html,it works!
## Structure
### Font end
* css
  * icon.extra.css
  * mescroll.css
  * mui.css
  * mui.picker.css
  * ref.css
* fonts
  * mui.ttf
  * mui-icons-extra.ttf
* img
  * referigerator.png
* js
  * mescroll.js
  * mui.min.js
  * mui.picker.js
  * ref.js
* ref.html
### Back end
* lib
  * create.js
  * delete.js
  * init.js
  * main.js
  * modify.js
  * option.js
* node_moudules
  * relevant node moudules
* built.json
* option.json
* cargo.json
## Configuration
### Server setting
``` javascript
  cd server
  vi built.json
```
!You can also use `vim built.json` instead.
* `port`: the port which server listend.
* `option`: the path where store option file.
* `cargo`: the path where store cargo file.

### General setting
``` javascript
  cd server
  vi option.json
```
!You can also use `vim built.json` instead.
* `general`: general setting.
  * `version`: application version.
  * `title`: application title.
  * `showVoid`: control weather show void categories or not.
  * `language`: control display language (under developing).
  * `night_mode`: night mode display by CSS change(under developing).
* `warns`: number warn setting.
  * `show`: show number warn function.
  * `level`: the level of number warn.
  * `brandary`: the brandary of each level.

## Function
* cargo number management
* classify by categories
* number warning function
* ...
