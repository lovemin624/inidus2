var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var path = require('path');

var router = express.Router();
var connection = mysql.createConnection({

	'host' : 'localhost',
	'user' : 'root',
	'password' : '',
	'database' : 'phototest',
});

router.get('/', function(request, response, next) {

	connection.query('select id, title from photo order by timestamp desc;', function (error, cursor) {

		if (error != undefined)
			response.sendStatus(503);
		else
			response.json(cursor);
	});
});

router.get('/:photo_id', function(request, response, next) {

	connection.query('select * from photo where id = ?;', [ request.params.photo_id], function (error, cursor) {

		if (error != undefined) {

			response.sendStatus(503);
		}
		else {

			if (cursor.length == undefined || cursor.length < 1)
				response.sendStatus(404);
			else
				response.json(cursor[0]);
		}
	});
});

router.get('/:photo_id/image', function(request, response, next) {

	connection.query('select * from photo where id = ?;', [ request.params.photo_id], function (error, cursor) {

		if (error != undefined) {

			response.sendStatus(503);
		}
		else {

			if (cursor.length == undefined || cursor.length < 1)
				response.sendStatus(404);
			else
				response.sendFile(path.join(__dirname, '../', cursor[0].path));
		}
	});
});

// TODO : 파일 업로드 구현.
router.post('/', function(request, response, next) {

	var title = request.body.title;
	var content = request.body.content;
    var path = request.body.path;
	var files = request.files;
    
	if (title == undefined || content == undefined ||
	   	files == undefined || files.length < 1) {

		response.sendStatus(403);
        console.log(JSON.stringify(error));
	}
	else {
		connection.query('insert into photo(title, content, path) values (?, ?, ?);', [ title, content, files.path.path ], function (error, info) {
			if (error != undefined) {
				response.sendStatus(503);
            console.log(JSON.stringify(error));
        }
			else {
				response.redirect('/photos/' + info.insertId);
            console.log(JSON.stringify(error));
    }
		});
	}
});


module.exports = router;
