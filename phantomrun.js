var cp = require('child_process');
var params =  require('./package');
var htmls = params.config.html;
var styles = params.config["style"];
var stylesopts = ' -s ' + styles.join(' -s ');
var filePath = 'http://localhost:3013/temp/'
var filePexi = 'run_result_'
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
cp.exec('phantomjs coverhtml.js ' + arr.join(' '), function (err, stdout,stderr) {
	console.log('stdout : \n' + stdout);
	var ditHtlms = ' '
	for (var i = 0; i < arr.length ; i ++) {
		ditHtlms += filePath + filePexi + (i + 1) + '.html ';
	}
	startServer(function () {
		doCover(ditHtlms);
	});
	
	
});
