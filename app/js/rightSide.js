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

    let newArticle = await getArticles(city);

    if (newArticle.articles.length == 0) {
        newArticle.articles.push(
            {
                title: "Please expand your search, no results found",
                publishedAt: null
            });
    }

    if (configuration.device == "desktop") {
        renderTemplate("rightSide", newArticle, $("#rightSideArticlesContainer"));
    } else if (configuration.device == "mobile") {
        renderTemplate("bottomSide", newArticle, $("#bottomSideArticlesContainer"));
    }

    cityOpen = city.geonameId;
}

async function getArticles(city) {
    return await newsAPI(city);
}