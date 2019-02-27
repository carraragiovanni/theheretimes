var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3006);



// var path = __dirname + '/public';
// var port = 1001;

// app.use(express.static(path));
// app.get('*', function (req, res) {
//     res.sendFile(path + '/index.html');
// });
// app.listen(port);