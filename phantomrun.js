process.chdir(__dirname);
var cp = require('child_process')
var colors = require('colors')
var params;
var filePath = 'http://localhost:3013/temp/'
var filePexi = 'run_result_'
var dwPath = './deadweight/bin/deadweight'
var args = process.argv.slice(2),
	optionType = args.shift();

this.config = {
	OPTION_TYPE : {
		JSON : '--json',
		SOURCE : '--source'
	}
}
console.log(optionType);
if (optionType === this.config.OPTION_TYPE.JSON) {
	console.log(args[0].replace(/^\'/,'').replace(/\'$/,'') + '\\' + args[1]);
	params =  require(args[0].replace(/^\'/,'').replace(/\'$/,'') + '\\' + args[1]);
} else if (optionType === this.config.OPTION_TYPE.SOURCE) {
	console.log(args[0].replace(/^\'/,'').replace(/\'$/,'') + '\\' + args[1]);
	params.config = {}
	params.style = args[1].split('|')[0].split(',');
	params.html = args[1].split('|')[1].split(',');
	console.log(params.style,params.html);
	return;
	// params =  require(args[0].replace(/^\'/,'').replace(/\'$/,'') + '\\' + args[1]);
}

var that = this;
/**
*	promise pattern 
*/
// function Promise (done, error) {
// 	_this._done = done;
// 	_this._error = error;

// } 
// Promise.prototype.success = function () {
// 	this._done && this._done.apply(this, arguments);
// }

// Promise.prototype.fail = function () {
// 	this._error && this._error.apply(this, arguments);
// }
// Promise.prototype.done = function () {
// 	_this._done = done;
// }

// Promise.prototype.error = function () {
// 	_this._error = error;
// }

/**
*	runing initialize
**/

function _initialize () {
	that.isServerStart = false;
}
function _start () {
	var htmls = params.config.html
		, styles = params.config["style"]
		, stylesopts = ' -s ' + styles.join(' -s ');
	//将配置文件的HTML属性读出来，放到数组中
	var htmlArray = _readHTMLPropertiesAsArray( htmls );
	//获取解析后的HTML文件
	_captureHTMLWhithArray(htmlArray, function (htmlParams) {
		_startHTTPServer(function () {
			_deadweightStyle(stylesopts, htmlParams, function (err) {
				err && console.log(err);
				// console.log('Please enter "Ctrl + C" to stop');
				process.kill(that._serverPid);
				
			});
		});
	});
}
/**
*	read file's html propertice
**/
function _readHTMLPropertiesAsArray (htmls) {
	var arr = [];
	for (var key in htmls) {
		if ( htmls[key] instanceof Array ) {
			for (var i = 0 ; i < htmls[key].length; i ++) {
				arr.push(key + htmls[key][i]);
			}
		} else {
			arr.push(key);
		}
	}
	return arr;
}
/**
*	start a http server for execute deadweight
**/
function _startHTTPServer (callback) {
	var proc = cp.spawn('node', ["app.js"]);
	proc.stdout.on('data', function (data) {
	   // if (!that.isServerStart) console.log('Http Server : ' + data);
	  if (!that.isServerStart) {
	  	console.log('Http Server : ' + data);
	  	that.isServerStart = true;
		callback && callback();
	  }
	});

	proc.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});

	proc.on('exit', function (code) {
	  console.log('Stop Http Server');
	});
	//记住该服务进程
	that._serverPid = proc.pid;
}
/**
*	Covering...Find verbose selector
**/
function _deadweightStyle (styles, htmls, deadweightCallback) {
	cp.exec('ruby ' + dwPath + styles + ' ' + htmls + ' -o result.log', function (err, stdout,stderr) {
		err && console.log(err);
		console.log(stdout);
		console.log(stderr);
		deadweightCallback && deadweightCallback(err);
	});
}

function _captureHTMLWhithArray (htmls, callback) {
	cp.exec('phantomjs coverhtml.js ' + htmls.join(' '), function (err, stdout,stderr) {
		console.log('Parsing URLS : \n' + stdout);
		var ditHtlms = ' '
		for (var i = 0; i < htmls.length ; i ++) {
			ditHtlms += filePath + filePexi + (i + 1) + '.html ';
		}
		callback && callback(ditHtlms);
	});
}
_start();