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