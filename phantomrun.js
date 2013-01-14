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
<<<<<<< HEAD
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
=======
	var proc = cp.spawn('node',['app.js']);
	var isruning = false;
	proc.stdout.on('data', function (data) {
		console.log("HTTP Server : " + data);
		if (!isruning) {
			callback && callback();
			isruning = true;
		}
	}),
	proc.stderr.on('data', function (data) {
		console.log(data);
	});
}
function doCover(ditHtlms) {
	cp.exec('ruby ./deadweight/bin/deadweight' + stylesopts + ' ' + ditHtlms + ' -o result.log', function (err, stdout,stderr) {
		console.log(err);
		console.log('stdout : \n' + stdout);
	});
}
>>>>>>> d3dd87dd1770b735367465ee9aad9e24b2f5c8d6
cp.exec('phantomjs coverhtml.js ' + arr.join(' '), function (err, stdout,stderr) {
	console.log('Parsing URLS : \n' + stdout);
	var ditHtlms = ' '
	for (var i = 0; i < arr.length ; i ++) {
		ditHtlms += filePath + filePexi + (i + 1) + '.html ';
	}
<<<<<<< HEAD
	startServer(function (callback) {
		doCover(ditHtlms, callback);
=======
	startServer(function () {
		doCover(ditHtlms);
>>>>>>> d3dd87dd1770b735367465ee9aad9e24b2f5c8d6
	});
	
	
});
