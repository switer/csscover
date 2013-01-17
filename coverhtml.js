/**
*	Capturing URL's HTML Content
*	@author switer
*/
var args 	= require('system').args,
	fs 		= require('fs'),
	count 	= 0,
	TEMP_DIRECTORY 		= './public/temp/',
	TEMP_FILE_PREFIX 	= 'run_result_';
	TEMP_FILE_SUFFIX 	= '.html';

for (var i = 0, len = args.length; i < len ; i ++) {
	if ( i !== 0) {
		(function (index, url) {
			var page = require('webpage').create();
			page.open(decodeURIComponent(url), function (status) {
				count ++ ;
				console.log('url : ' + decodeURIComponent(url) + '   ( status : ' + status + ' )');
				fs.write(TEMP_DIRECTORY + TEMP_FILE_PREFIX + index + TEMP_FILE_SUFFIX, page.content);
				if (count >= len - 1) {
					console.log('Parsing Compeleted !');
					phantom.exit();
				}
			})
		})(i, args[i]);
	}
}

