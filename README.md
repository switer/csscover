#csscover
========

Use [phantomjs](https://github.com/ariya/phantomjs) and [deadweight](https://github.com/aanand/deadweight) to do CSS coverage-testing
## Why csscover ?
> csscover基于[deadweight](https://github.com/aanand/deadweight), 功能上肯定是会优于deadweight的，
> 且添加了selector的容错机制与对中文字符的处理机制，更重要的是，支持deadweight所不支持的动态脚本改变DOM
> 影响的选择器匹配

##Use case

- 检查页面冗余style rule</li>

How to use
---
###要安装的东西比较多###
*   Install [ruby](http://rubyinstaller.org/) and gems for deadweight.
*   Install [deadweight](https://github.com/aanand/deadweight) `gem install deadweight` (csscover 已内嵌
    了deadweight，why need to install deadweight ？ 因为DW的依赖没有内嵌，例如addressable、nokogiri、css_parser).
*   Install [node](http://nodejs.org).

Clone it from github :

    git clone https://github.com/switer/csscover.git

or Install it in npm :

    npm install csscover -g
    
Runing : 

    csscover --help
    
package.js :

    //这个文件是样式文件的配置，在example上有
    style : 样式文件
    html : [
        'url',//被检查的网址
        {//可以用于url + hash的形式 prefix +　suffix
            prefix : purl, //网址前缀
            suffix : ['','#'] //网址后缀
        }
    ]

##Compatible
    
    Sorry ! 暂时只支持windows，linux稍后推出....至于Mac...我还没有玩过。

##Support
  &lt;guankaishe@gmail.com&gt;


    
