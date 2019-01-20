async function sideRightOpenAndParse(city) {
    if (configuration.device == "desktop") {
        $("#rightSide").show();
        rightSideOpen = true;
        renderTemplate("rightSideTitle", city.name, $("#rightSide"));
    } else if (configuration.device == "mobile") {
        $("#bottomSide").show();
        bottomSideOpen = true;
        renderTemplate("bottomSideTitle", city.name, $("#bottomSide"));
    }

    let idbArticle = await getArticles(city);

    if (idbArticle.articles.length == 0) {
        newArticle.articles.push(
            {
                title: "Please expand your search, no results found",
                publishedAt: null
            });
    }

    if (configuration.device == "desktop") {
        renderTemplate("rightSide", idbArticle.articles, $("#rightSideArticlesContainer"));
    } else if (configuration.device == "mobile") {
        renderTemplate("bottomSide", idbArticle.articles, $("#bottomSideArticlesContainer"));
    }

    cityOpen = city.geonameId;
}

async function getArticles(city) {
    let articles = await getArticlesIDB();
    let exisitingArticles = _.filter(articles, {city_id: city.id});
    let existingArticle = checkMatchingArticles(exisitingArticles);
    console.log(exisitingArticle);
    if (existingArticle != null) {
        console.log("existingArticle");
        return exisitingArticle;
    } else {
        console.log("newArticle");
        let newArticles = await newsAPI(city); 
        let idbArticle = createIDBArticles(newArticles, city);
        db.articles.put(idbArticle);
        return idbArticle;
    }
}

function checkMatchingArticles(exisitingArticles) {
    for (exisitingArticle of exisitingArticles) {
        if (exisitingArticle.language == configuration.language) {
            if (exisitingArticle.sortBy == configuration.sortBy) {
                if (exisitingArticle.publishedSince == configuration.publishedSince) {
                    if (moment().subtract(15, 'second').isBefore(exisitingArticle.downloadedAt)) {
                        return exisitingArticle;
                    }
                }
            }
        } 
    }
}

function createIDBArticles(articles, city) {
    let article = {
        city_id: city.id,
        geonameId: city.geonameId,
        publishedSince: configuration.publishedSince,
        sortBy: configuration.sortBy,
        articles: articles,
        language: configuration.language,
        downloadedAt: moment().toISOString()
    }
    return article;
}