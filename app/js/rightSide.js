async function sideRightOpenAndParse(city) {
    if (localStorage.getItem('device') == 'desktop') {
        $("#rightSide").show();
        rightSideOpen = true;
        renderTemplate("rightSideTitle", city.name, $("#rightSide"));
    } else if (configuration.device == "mobile") {
        $("#bottomSide").show();
        bottomSideOpen = true;
        renderTemplate("bottomSideTitle", city.name, $("#bottomSide"));
    }

    let articles = await getArticles(city);
    
    if (localStorage.getItem('device') == "desktop") {
        renderTemplate("rightSide", articles, $("#rightSideArticlesContainer"));
    } else if (localStorage.getItem('device') == "mobile") {
        renderTemplate("bottomSide", articles, $("#bottomSideArticlesContainer"));
    }
    
    cityOpen = city.geonameId;
}

async function getArticles(city) {
    var dateFrom = moment().subtract(localStorage.getItem('daysSincePublished'), "days").format("YYYY-MM-DD");
    return await axios({
        method: 'GET',
        url: `/articles?q=${city.name}&lang=${localStorage.getItem('language')}&from=${dateFrom}&sortBy=${localStorage.getItem('sortBy')}`,
    }).then(function (response) {
        return response.data.articles.articles;
    });
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