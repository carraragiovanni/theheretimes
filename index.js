var axios = require('axios');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

app.route('/cities').get(async function (req, res) {
    return await axios({
        method: 'GET',
        url: `http://api.geonames.org/citiesJSON?north=${req.query.north}&south=${req.query.south}&east=${req.query.east}&west=${req.query.west}&maxRows=3&lang=${req.query.lang}}&username=carraragiovanni`
    }).then(function (response) {
        res.send({
            cities: response.data
        });
    });
});

app.listen(process.env.PORT || 3004);
