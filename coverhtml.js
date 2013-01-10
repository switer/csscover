// var cp = require('child_process');
// var fs = require('fs');
// var config = require('package');
// cp.exec('phantomjs ', function () {

// });
var args = require('system').args;
var fs = require('fs');
var count = 0,
	path = './public/temp/';
for (var i = 0; i < args.length ; i ++) {
	if ( i !== 0) {
		(function (index, url) {
			var page = require('webpage').create();
			page.open(url, function () {
				count ++ ;
				console.log('url : ' + url + '  index : ' + index);
				fs.write(path + 'run_result_' + index + '.html', page.content);
				if (count >= args.length - 1) {
					console.log('finish');
					phantom.exit();

				}
			})
		})(i, args[i]);
	}
}
