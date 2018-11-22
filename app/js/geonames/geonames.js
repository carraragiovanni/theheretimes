async function getCitiesInBoundsGeonames(bounds) {
    let username = 'carraragiovanni';
    await getLanguage();

    return await axios({
        method: 'get',
        url: `http://api.geonames.org/citiesJSON?north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}&maxRows=2&lang=${configuration.language}&username=${username}`,
    }).then(function (response) {
        return response.data.geonames;
    });
}

async function createIDBObject(geonamesCity) {
    await getLanguage();

    let city = {
        name: geonamesCity.name,
        lat: geonamesCity.lat,
        lng: geonamesCity.lng,
        geonameId: geonamesCity.geonameId,
        language: configuration.language,
        articlesObj: [],
    }

    await putIDBNewCity(city);
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
