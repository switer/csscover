var cp = require('child_process');
var colors = require('colors');
var params =  require('./package');
var htmls = params.config.html;
var styles = params.config["style"];
var stylesopts = ' -s ' + styles.join(' -s ');
var filePath = 'http://localhost:3013/temp/'
var filePexi = 'run_result_'
var dwPath = './deadweight/bin/deadweight'
var arr = [];

for (var key in htmls) {
	if ( htmls[key] instanceof Array ) {
		for (var i = 0 ; i < htmls[key].length; i ++) {
			arr.push(key + '#' + htmls[key][i]);
		}
	} else {
		arr.push(key);
	}
}
function startServer (callback) {
	var isStart = false;
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
}
function doCover(ditHtlms, callback) {
	console.log('exec : ' + 'deadweight' + stylesopts + ' ' + ditHtlms + ' -o result.log');
	cp.exec('ruby ' + dwPath + stylesopts + ' ' + ditHtlms + ' -o result.log', function (err, stdout,stderr) {
		err && console.log(err);
		console.log(stdout.split('===Error')[0].blue, stdout.split('===Error')[1].red);
		callback && callback();
	});
}
console.log('exec : ' + 'phantomjs coverhtml.js ' + arr.join(' ').blue);
cp.exec('phantomjs coverhtml.js ' + arr.join(' '), function (err, stdout,stderr) {
	console.log('Parsing URLS : \n' + stdout);
	var ditHtlms = ' '
	for (var i = 0; i < arr.length ; i ++) {
		ditHtlms += filePath + filePexi + (i + 1) + '.html ';
	}
	startServer(function (callback) {
		doCover(ditHtlms, callback);
	});
	
	
});
