#csscover
========

Use [phantomjs](https://github.com/ariya/phantomjs) and [deadweight](https://github.com/aanand/deadweight) to do CSS coverage-testing
## Why csscover ?
> csscover基于[deadweight](https://github.com/aanand/deadweight), 功能上肯定是会优于deadweight的，<br />
> 且添加了selector的容错机制与对中文字符的处理机制，更重要的是，<br />
> 支持deadweight所不支持的动态脚本改变DOM影响的选择器匹配

##Use case

- 检查页面冗余style rule</li>

How to use
---
###要安装的东西比较多###
*   Install [ruby and gems](http://rubyinstaller.org/) for deadweight. `Add Ruby executables to your PATH` <br />
    ![ruby install](https://raw.github.com/switer/resource/master/ruby_install.png)
*   Install [deadweight](https://github.com/aanand/deadweight) `gem install deadweight` <br />
    (csscover 已内嵌了deadweight，why need to install deadweight ？ 因为DW的依赖没有内嵌，例如addressable、nokogiri、css_parser).
*   Install [nodejs](http://nodejs.org).

Clone it from github :

    git clone https://github.com/switer/csscover.git

or Install it in npm :

    npm install csscover -g
    
Runing : 

    csscover --help
    
package.js :

    //这个文件是样式文件的配置，在example上有
    { 
        "style" : 样式文件
        "html" : [
            "url",//被检查的网址
            {//可以用于url + hash的形式 prefix +　suffix
                "prefix" : purl, //网址前缀
                "suffix" : ["","#"] //网址后缀
            }
        ]
    }
    
example : 

    //请用"" 代替''
    //('style':[] #-> wrong,)
    //("style":[] #-> right,)
    {
        "style" : [
    		"style.css"
    	],
    	"html" : [
    		"http://www.baidu.com", 
    		{
    		    "prefix" : "http://www.baidu.com",
    		    "suffix" : ["/s?wd=new&rsv_bp=0&rsv_spt=3&rsv_sug3=2&rsv_sug=0&rsv_sug4=114&rsv_sug1=1&inputT=692"]
    		}
    	]
    }

##Compatible
    
    Sorry ! 暂时只支持windows，linux稍后推出....至于Mac...我还没有玩过。

##Support

  `如果你运行时，遇到以下的情况`<br />
  <br />
  ![node error](https://raw.github.com/switer/resource/master/node_error.png)<br />
  <br />
  `别着急，是node服务端口被占用了，在任务管理器找出node的进程，kill掉它`<br />
  <br />
  ![kill node process](https://raw.github.com/switer/resource/master/node_process.png)<br /><br />
  <br />
  `Author support` &lt;guankaishe@gmail.com&gt;


    
