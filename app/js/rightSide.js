async function sideRightOpenAndParse(city) {
    if (!city) {
        let cities = await getCitiesInBoundsinIDB();
        city = _.findWhere(cities, {geonameId: cityOpen});
    }

    if (configuration.device == "desktop") {
        $("#rightSide").show();
        rightSideOpen = true;
        renderTemplate("rightSideTitle", city.name, $("#rightSide"));
    } else if (configuration.device == "mobile") {
        $("#bottomSide").show();
        bottomSideOpen = true;
        renderTemplate("bottomSideTitle", city.name, $("#bottomSide"));
    }

    console.log(city)
    let newArticle = await newsAPI(city);

    if (newArticle.articles.length == 0) {
        newArticle.articles.push(
            {
                title: "Please expand your search, no results found",
                publishedAt: null
            });
    }
    debugger;

    if (configuration.device == "desktop") {
        renderTemplate("rightSide", newArticle, $("#rightSideArticlesContainer"));
    } else if (configuration.device == "mobile") {
        renderTemplate("bottomSide", newArticle, $("#bottomSideArticlesContainer"));
    }

    cityOpen = city.geonameId;
    // if (configuration.device == "desktop") {
    // } else if (configuration.device == "mobile") {
    //     renderTemplate("bottomSide", newArticle.articles, $("#bottomSideArticlesContainer"));
    // }

    // let sixHours = moment().subtract(6, "hours");
    // let sixSeconds = moment().subtract(6, "seconds");

    // let languageInputArticles = _.filter(city.articlesObj, {
    //     articlesLanguage: configuration.languageInput
    // });
    // let sortByArticles = _.filter(languageInputArticles, {
    //     sortBy: configuration.sortBy
    // });
    // let publishedSinceArticles = _.filter(sortByArticles, {
    //     publishedSince: configuration.publishedSince
    // });
    
    // let sorted = _.sortBy(publishedSinceArticles, function (article) {return article.publishedSince});
    // debugger;
    // if (moment(sorted[0].articlesLastDownload).isBefore(sixSeconds)) {
    //     let newArticle = await newsAPI(city);
    //     city.articlesObj = newArticle;
    //     await db.cities.put(city);
    // } else {
    //     console.log(sorted);
    // }
}