async function getCitiesInBoundsGeonames() {
    let username = 'carraragiovanni';
    let numberCities = 3;

    return await axios({
        method: 'GET',
        url: `https://cors-anywhere.herokuapp.com/http://api.geonames.org/citiesJSON?north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}&maxRows=${numberCities}&lang=${configuration.language}&username=${username}`,
    }).then(function (response) {
        return response.data.geonames;
    });
}

async function getCityNewLanguage(geonameID, language) {
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

async function putIDBNewCity(city) {
    let cities = await db.cities.toArray();
    let existingCities = _.where(cities, {geonameId: city.geonameId});
    let languages = [];

    if (existingCities != null) {
        existingCities.forEach(async function (existingCityfromArray) {
            languages.push(existingCityfromArray.language);
        });
        if (!_.contains(languages, city.language)) {
            db.cities.put(city);
        }
    }
}
