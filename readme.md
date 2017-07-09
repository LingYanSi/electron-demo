# Electron

## 安装
cnpm i electron -g

## 运行
electron app.js

## 教程
可以在script中直接使用require('fs')方式，调用node模块 ☀️


## issue
I can not use jQuery/RequireJS/Meteor/AngularJS in Electron.

Due to the Node.js integration of Electron, there are some extra symbols inserted into the DOM like module, exports, require. This causes problems for some libraries since they want to insert the symbols with the same names.

To solve this, you can turn off node integration in Electron:
有些库为了兼容cmd规范
if ( module ) {
    module.exports = jquery
} else {
    window.jquery = jquery
}
而electron默认在浏览器实现了module,export,require，因此这里的jquery就挂了

如果想修复：
- 去除jQuery对cmd的兼容
- 或者缓存module对象，等待加载完毕后再回复module
- 关闭electron的node integration
[这理有说明](http://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined)
