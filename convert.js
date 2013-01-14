var fs = require('fs');
var filename = 'style.css';
fs.readFile(filename, 'utf8', function (err ,data) {
	if (err) console.log(err);
	var encodeData = data.replace(/[\u0080-\uFFFF]/g,'');
	fs.writeFileSync('cv_' + filename, encodeData, 'utf8');
});
