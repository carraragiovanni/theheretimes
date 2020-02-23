var axios = require('axios');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

app.route('/language').get(async function (req, res) {
    return await axios({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.query.lat},${req.query.lng}&key=AIzaSyA06I_-sl_8jRhBn1KUjmmVq75eU1H9Rxw`
    }).then(function (response) {
        res.send({
            language: response.data
        });
    });
});

app.route('/cities').get(async function (req, res) {
    let maxRows = 8;
    return await axios({
        method: 'GET',
        url: `http://api.geonames.org/citiesJSON?north=${req.query.north}&south=${req.query.south}&east=${req.query.east}&west=${req.query.west}&maxRows=${maxRows}&lang=${req.query.lang}}&username=carraragiovanni`
    }).then(function (response) {
        res.send({
            cities: response.data
        });
    });
});

app.route('/articles').get(async function (req, res) {
    // let apiKeyNewsAPI = '22f8d579867948f991198b333b9a967d';
    let apiKeyNewsAPI = 'ba114202f6c04b70a953c0624e570b51';
    // let apiKeyNewsAPI = 'cc3709c07a28493ba67d4baf15857ded';

    return await axios({
        method: 'GET',
        url: `https://newsapi.org/v2/everything?q=${req.query.q}&language=${req.query.lang}&from=${req.query.from}&sortBy=${req.query.sortBy}&apiKey=${apiKeyNewsAPI}`
    }).then(function (response) {
        res.send({
            articles: response.data,
        });
    });
});

app.listen(process.env.PORT || 4600);
