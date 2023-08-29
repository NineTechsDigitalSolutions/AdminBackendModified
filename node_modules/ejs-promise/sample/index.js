var express = require('express'),
    ejs = require('../lib/ejs.js');
var app = express();
app.engine('.html', ejs.__express);
app.set('view engine', 'ejs-stream');
app.get('/', function(req, res) {
	res.render(__dirname + '/index.html', {header: 'Hello EJS'});
});
app.get('/wait', function(req, res) {
    res.header('content-type', 'text/html')
	ejs.renderFile(__dirname + '/wait.html', {
	    wait: function (ms) {
        	return new Promise(function (resolve, reject) {
    	        setTimeout(resolve, ms);
            })  
    	}
	}, function (err, p) {
		p.noBuffer();
		p.waitFlush();
	    p.outputStream.pipe(res);
	    res.on('close', function () {
	    	p.defered.interrupt();
	    })
	});
});
app.get('/include-wait', function(req, res) {
    res.header('content-type', 'text/html')
	ejs.renderFile(__dirname + '/included_wait.html', {
	    wait: function (ms) {
        	return new Promise(function (resolve, reject) {
    	        setTimeout(resolve, ms);
            })  
    	}
	}, function (err, p) {
		p.noBuffer();
		p.waitFlush();
	    p.outputStream.pipe(res);
	    res.on('close', function () {
	    	p.defered.interrupt();
	    })
	});
});
app.get('/ping', function(req, res) {
	var child = require("child_process").spawn('ping', ['8.8.8.8']);
	var readline = require('readline');
	
	const rl = readline.createInterface({
	  input: child.stdout,
	  output: require("fs").createWriteStream('/dev/null')
	});
	
	var lines = [];
	var waiting = null;
	rl.on('line', function (line) {
		console.log(line)
		lines.push(line);
		if (waiting) {
			waiting.resolve(lines.shift())
			waiting = null;
		}
	})
	
    res.header('content-type', 'text/html');
	ejs.renderFile(__dirname + '/ping.html', {
	    getLine: function () {
        	if (lines.length > 0) return lines.shift()
        	return new Promise(function (resolve, reject) {
        		waiting = {};
        		waiting.resolve = resolve;
        		waiting.reject = reject;
        	})
    	}
	}, function (err, p) {
		p.noBuffer();
		p.waitFlush();
	    p.outputStream.pipe(res);
	    res.on('close', function () {
	    	p.defered.interrupt();
	    	child.kill();
	    })
	});
});
var server = app.listen(process.env.PORT || 3000, process.env.IP || 'localhost' ,function () {
  console.log('Example app listening at http://' + (process.env.IP || 'localhost') + ':' + (process.env.PORT || 3000) +'/');
});