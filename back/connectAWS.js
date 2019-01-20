var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'theheretimes.cdaqyzoo42nj.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Pirelli2014!?',
    port: '3306'
});

connection.connect(function(err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    
    console.log('Connected to database.');
});

connection.end();