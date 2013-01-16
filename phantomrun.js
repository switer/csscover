
var cp = require('child_process')
var colors = require('colors')

var filePath = 'http://localhost:3013/temp/'
var filePexi = 'run_result_'
var dwPath = './deadweight/bin/deadweight'
var args = process.argv.slice(2),
	optionType = args.shift();
	localPath  = args.shift().replace(/^\'/,'').replace(/\'$/,'');
var params;
this.config = {
	OPTION_TYPE : {
		JSON : 'json',
		SOURCE : 'source'
	}
}
if (optionType === this.config.OPTION_TYPE.JSON) {
	params =  require(localPath + '\\' + args.shift());
	params.config.html  = _populateLocalURL(params.config.html, localPath)
	params.config.style = _populateLocalURL(params.config.style, localPath)
	console.log(params);
} else if (optionType === this.config.OPTION_TYPE.SOURCE) {
	params = {
		config : {}
	}
	var cssParams = args.shift().split(','),
		htmlParams   = args.shift().split(',');
	params.config.html  = _populateLocalURL(htmlParams, localPath)
	params.config.style = _populateLocalURL(cssParams, localPath)
	console.log(params);
}
var outputFile = args.shift();
process.chdir(__dirname);
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
	var htmlUrl;
	for (var i = 0; i < htmls.length ; i++ ) {
		htmlUrl = htmls[i];
		if ( typeof htmlUrl !== 'string' && (htmlUrl instanceof Object)) {
			for (var j = 0; j < htmlUrl['suffix'].length; j ++) {
				arr.push(htmlUrl['prefix'] + htmlUrl['suffix'][j]);
			}
		} else if (typeof htmlUrl === 'string') {
			arr.push(htmlUrl);
		} else {
			throw new Error('Unknow URL Collection error !');
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
	  	console.log('Http Server : '.cyan + data);
	  	that.isServerStart = true;
		callback && callback();
	  }
	});

	proc.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});

	proc.on('exit', function (code) {
	  console.log('Exit Http Server...');
	});
	//记住该服务进程
	that._serverPid = proc.pid;
}
/**
*	Covering...Find verbose selector
**/
function _deadweightStyle (styles, htmls, deadweightCallback) {
	// process.chdir(localPath);
	cmd = 'ruby ' + dwPath + styles + ' ' + htmls + ' -o ' + localPath + '/' + outputFile
	cp.exec('ruby ' + dwPath + styles + ' ' + htmls + ' -o ' + localPath + '/' + outputFile, function (err, stdout,stderr) {
		console.log('Cover result in : ' + outputFile.grey);
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
function _populateLocalURL (urlArray, path) {
	var pUrlArray = [];
	for (var i = 0; i < urlArray.length ; i ++) {
		/**
		*	http:// | https:// | file:// | A:/ | (linux root /)
		**/
		if (!urlArray[i].match(/^http(?=):\/\/|^https:\/\/|^file:\/\/|^[a-zA-Z]:\/|^\//)) {
			pUrlArray.push( path.replace(/\/$/, '') + '/' + urlArray[i]);
		} else {
			pUrlArray.push(urlArray[i]);
		}
	}
	return pUrlArray;
}
_start();