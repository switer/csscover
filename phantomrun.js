var cp = require('child_process')
var colors = require('colors')
var params =  require('./package')
var htmls = params.config.html
var styles = params.config["style"]
var stylesopts = ' -s ' + styles.join(' -s ')
var filePath = 'http://localhost:3013/temp/'
var filePexi = 'run_result_'
var dwPath = './deadweight/bin/deadweight'
var args = process.argv


var _this = this;

/**
*	promise pattern 
*/
function Promise (done, error) {
	_this._done = done;
	_this._error = error;

} 
Promise.prototype.success = function () {
	this._done && this._done.apply(this, arguments);
}

Promise.prototype.fail = function () {
	this._error && this._error.apply(this, arguments);
}
Promise.prototype.done = function () {
	_this._done = done;
}

Promise.prototype.error = function () {
	_this._error = error;
}

/**
*	runing initialize
**/

function _initialize () {
	_this.isServerStart = false;
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
	var _this._isStart = false;
	var proc = cp.spawn('node', ["app.js"]);
	proc.stdout.on('data', function (data) {
	  console.log('Http Server : server listening on port ' + data);
	  if (!isStart) {
	  	isStart = true;
		callback && callback(function () {
			console.log('Please enter "Ctrl + C" to stop');
		});
	  }
	});

	proc.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});

	proc.on('exit', function (code) {
	  console.log('child process exited with code ' + code);
	});

	this._serverPid = proc.pid;
}
/**
*	Covering...Find verbose selector
**/
function _deadweightStyle (styles, htmls) {
	cp.exec('ruby ' + dwPath + styles + ' ' + htmls + ' -o result.log', function (err, stdout,stderr) {
		err && console.log(err);
		console.log(stdout.split('===Error')[0].blue, stdout.split('===Error')[1].red);
		console.log('Runing server pid : ' + this._serverPid);
	});
}

function _captureHTMLWhithArray (htmls) {
	console.log('exec : ' + 'phantomjs coverhtml.js ' + htmls.join(' ').blue);
	cp.exec('phantomjs coverhtml.js ' + htmls.join(' '), function (err, stdout,stderr) {
		console.log('Parsing URLS : \n' + stdout);
		var ditHtlms = ' '
		for (var i = 0; i < htmls.length ; i ++) {
			ditHtlms += filePath + filePexi + (i + 1) + '.html ';
		}
		_startHTTPServer(function () {
			if (_this.styles) _deadweightStyle(_this.styles, ditHtlms);
			else throw new Error("Can't find style files !");
		});
	});
}

