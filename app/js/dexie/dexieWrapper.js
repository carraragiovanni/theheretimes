const db = new Dexie('citiesDatabase');

db.version(1).stores({
    cities: 'id++, city, geonamesId, language, articles, articlesLastDownload'
});

async function getCitiesInBoundsinIDB() {
    return await db.cities.toArray();
}