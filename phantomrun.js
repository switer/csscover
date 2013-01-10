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
function startServer () {
	cp.exec('node app.js', function (err, stdout,stderr) {
		console.log('error : ' + err);
		console.log('stdout : \n' + stdout);
	});
}
function doCover(ditHtlms) {
	console.log('exec : ' + 'deadweight' + stylesopts + ' ' + ditHtlms + ' -o result.log');
	cp.exec('deadweight' + stylesopts + ' ' + ditHtlms + ' -o result.log', function (err, stdout,stderr) {
		console.log(err);
		console.log('stdout : \n' + stdout);
	});
}
console.log('exec : ' + 'phantomjs coverhtml.js ' + arr.join(' '));
cp.exec('phantomjs coverhtml.js ' + arr.join(' '), function (err, stdout,stderr) {
	console.log('stdout : \n' + stdout);
	var ditHtlms = ' '
	for (var i = 0; i < arr.length ; i ++) {
		ditHtlms += filePath + filePexi + (i + 1) + '.html ';
	}
	// startServer();
	doCover(ditHtlms);
	
});
