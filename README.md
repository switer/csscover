csscover
========

Use [phantomjs](https://github.com/ariya/phantomjs) and [deadweight](https://github.com/aanand/deadweight) to do CSS coverage-testing
## Why csscover ?
- csscover基于[deadweight](https://github.com/aanand/deadweight), 功能上肯定是会优于deadweight的，
- 且添加了selector的容错机制与对中文字符的处理机制，更重要的是，支持deadweight所不支持的动态脚本改变DOM
- 影响的选择器匹配，example/valid 有验证demo。(亲，暂时未写)
##Use case
- remove verbose stylerule from stylesheet file

How to use
---
Install it.

    git clone

or

    npm install csscover -g
    
Runing
---
Step 1 :
    
