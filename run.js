var cp = require('child_process');
var params =  require('./package');
var styles = params.config.style;
var stylesopts = ' -s ' + styles.config.html.join(' -s ');
console.log('exec : ' + 'deadweight' + stylesopts + ' ' + arr.join(' '));
cp.exec('deadweight' + stylesopts + ' ' + arr.join(' ') + arr.join(' '), function (err, stdout,stderr) {
	console.log('stdout : \n' + stdout);
});