var pg = require('pg');

var username = 'dbuser';
var password = 'foo';
var client = new pg.Client('tcp://' + username + ':' + password + '@localhost/friidrett');

client.connect(function (err) {
    if (err) {
        console.dir(err);
        return;
    }

    client.query('SELECT * FROM Discipline', function(err, result) {
        console.dir(result.rows[0].disciplinename);
    });
});

