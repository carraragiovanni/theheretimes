const db = new Dexie('citiesDatabase');

db.version(1).stores({
    cities: 'id++, city, geonamesId, language, articles, articlesLastDownload',
    articles: 'id++, city_id, geonameId, publishedSince, sortBy, articles, language, downloadedAt'
});

async function getCitiesIDB() {
    return await db.cities.toArray();
}
async function getArticlesIDB() {
    return await db.articles.toArray();
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
