async function newsAPI(city) {
    // let apiKeyNewsAPI = '22f8d579867948f991198b333b9a967d';
    let apiKeyNewsAPI = 'ba114202f6c04b70a953c0624e570b51';
    // let apiKeyNewsAPI = 'cc3709c07a28493ba67d4baf15857ded';
    
    let datePublishedSince = moment().subtract(configuration.publishedSince, "days").toISOString();

    return await axios({
        method: 'get',
        url: `https://newsapi.org/v2/everything?q=${city.name}&language=${configuration.language}&from=${datePublishedSince}&sortBy=${configuration.sortBy}&apiKey=${apiKeyNewsAPI}`,
    }).then(async function (response) {
        articleObj = {
            articles: response.data.articles,
            articlesLanguage: configuration.language,
            articlesLastDownload: moment().toISOString(),
            publishedSince: configuration.publishedSince,
            sortBy: configuration.sortBy
        };
        city.articlesObj.push(articleObj);
        await db.cities.put(city);
        return city;
    });
}