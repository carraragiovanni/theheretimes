var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname)));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
});

app.listen(process.env.PORT || 8088);