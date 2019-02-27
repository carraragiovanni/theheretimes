async function getCitiesInBoundsGeonames() {
    let username = 'carraragiovanni';
    let numberCities = 3;
    
    return await axios({
        method: 'GET',
        url: `https://cors-anywhere.herokuapp.com/http://api.geonames.org/citiesJSON?north=${boundsWithMargin.north}&south=${boundsWithMargin.south}&east=${boundsWithMargin.east}&west=${boundsWithMargin.west}&maxRows=${numberCities}&lang=${configuration.language}&username=${username}`
    }).then(function (response) {
        return response.data.geonames;
    });
}

async function getCityNewLanguage(geonameID, language) {
    // let username = 'carraragiovanni';
    let username = 'carraragiovanni';

    return await axios({
        method: 'GET',
        url: `https://cors-anywhere.herokuapp.com/http://api.geonames.org/getJSON?geonameId=${geonameID}&lang=${language}&username=${username}`,
    }).then(function (response) {
        return response.data;
    });
}

function createIDBObject(geonamesCity) {
    let city = {
        name: geonamesCity.name,
        lat: geonamesCity.lat,
        lng: geonamesCity.lng,
        geonameId: geonamesCity.geonameId,
        language: configuration.language,
        population: geonamesCity.population,
        articlesObj: [],
    }

    return city;
}
