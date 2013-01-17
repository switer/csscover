
var cp = require('child_process'),
	colors = require('colors'),
	fs = require('fs');

var	HTML_TEMP_URI = 'http://localhost:3013/temp/',
	HTML_TEMP_FILE_PREFIX = 'run_result_',
	HTML_TEMP_FILE_SUFFIX = '.html',
	DEADWEIGHT_LIB_PATH = './deadweight/bin/deadweight',
	CAPTURE_HTML_SCRIPT = 'coverhtml.js';

var	args = process.argv.slice(2),
	optionType = args.shift(),
	localPath  = args.shift().replace(/^\'/,'').replace(/\'$/,''),
	params;

var REGEXES  = {
		URI_REGEX : /^http(?=):\/\/|^https:\/\/|^file:\/\/|^[a-zA-Z]:\/|^\//
	};
this.config = {
	OPTION_TYPE : {
		JSON : 'json',
		SOURCE : 'source'
	}
}
if (optionType === this.config.OPTION_TYPE.JSON) {
	var packageJsName = args.shift()
	// params =  require(localPath + '\\' + packageJsName);
	// try {
		var params = JSON.parse(_readPackgeFile(localPath + '\\' + packageJsName));
		params.html  = _populateLocalURL(_readHTMLPropertiesAsArray(params.html), localPath, true)
		params.style = _populateLocalURL(params.style, localPath)
	// } catch (e) {
	// 	throw new Error('Read configure file Error ! Please check it exist or not, or format error !');
	// }


} else if (optionType === this.config.OPTION_TYPE.SOURCE) {
	params = {}
	var cssParams = args.shift().split(','),
		htmlParams   = args.shift().split(',');
	params.html  = _populateLocalURL(htmlParams, localPath, true)
	params.style = _populateLocalURL(cssParams, localPath)
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
	var htmls = params.html
		, styles = params["style"]
		, stylesopts = ' -s ' + styles.join(' -s ');
	//将配置文件的HTML属性读出来，放到数组中
	// var htmlArray = _readHTMLPropertiesAsArray( htmls );
	//获取解析后的HTML文件
	_captureHTMLWhithArray(htmls, function (htmlParams) {
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
	cmd = 'ruby ' + DEADWEIGHT_LIB_PATH + styles + ' ' + htmls + ' -o ' + localPath + '/' + outputFile
	cp.exec('ruby ' + DEADWEIGHT_LIB_PATH + styles + ' ' + htmls + ' -o ' + localPath + '/' + outputFile, function (err, stdout,stderr) {
		console.log('Covered result in : ' + outputFile.grey);
		err && console.log(err);
		console.log(stdout);
		console.log(stderr);
		deadweightCallback && deadweightCallback(err);
	});
}

function _captureHTMLWhithArray (htmls, callback) {
	cp.exec('phantomjs ' + CAPTURE_HTML_SCRIPT + ' ' + htmls.join(' '), function (err, stdout,stderr) {
		console.log('Parsing URLS : \n' + stdout);
		var distHtlms = ' '
		for (var i = 0; i < htmls.length ; i ++) {
			distHtlms += HTML_TEMP_URI + HTML_TEMP_FILE_PREFIX + (i + 1) + HTML_TEMP_FILE_SUFFIX + ' ';
		}
		callback && callback(distHtlms);
	});
}
function _populateLocalURL (urlArray, path, isEncoding) {
	var pUrlArray = [];
	var uri;
	for (var i = 0; i < urlArray.length ; i ++) {
		/**
		*	http:// | https:// | file:// | A:/ | (linux root /)
		**/
		if (!urlArray[i].match(REGEXES.URI_REGEX)) {
			uri = path.replace(/\/$/, '') + '/' + urlArray[i];
			isEncoding && (uri = encodeURIComponent(uri));
			pUrlArray.push( uri );
		} else {
			uri = isEncoding ? encodeURIComponent(urlArray[i]) : urlArray[i];
			pUrlArray.push( uri );
		}
	}
	return pUrlArray;
}

function _readPackgeFile (path) {
	var content =  fs.readFileSync(path, 'UTF-8');
  return content;
}
_start();