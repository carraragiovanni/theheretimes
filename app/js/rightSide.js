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

    let sixHours = moment().subtract(6, "hours");


    // if (city.articlesObj != 0) {
    //     city.articlesObj.forEach(function (articleObj) {
    //         if (articleObj.articlesLanguage == configuration.language) {
    //             if (articleObj.publishedSince == configuration.publishedSince) {
    //                 if ()
    //             }
    //         }
    //     })
    // }
    
    // if (city.articlesObj.length <= 0) {
    //     city = await newsAPI(city);
    // } else {
    //     for (let element of city.articlesObj) {
    //         if (element.articlesLanguage == configuration.language && element.publishedSince == configuration.publishedSince && element.sortBy == configuration.sortBy && moment(element.articlesLastDownload).isAfter(fiveMins)) {
    //             console.log("Article with these params exists");
    //             articleObj = element;
    //         }
    //     };
    // }

    // let articlesObj = city.articlesObj;

    // let articlesLanguage = _.where(articlesObj, {articlesLanguage: configuration.language});
    // if (articlesLanguage.length == 1) {
    //     articlesObj = articlesLanguage[0];
    // } else {
    //     let articlesPublishedSince = _.where(articlesLanguage, {publishedSince: configuration.publishedSince});
    //     if (articlesPublishedSince.length == 1) {
    //         articlesObj = articlesPublishedSince[0];
    //     } else {
    //         let articlesSortBy = _.where(articlesPublishedSince, {sortBy: configuration.sortBy});
    //         if (articlesSortBy.length == 1) {
    //             articlesObj = articlesSortBy[0];
    //         } else {
    //             console.log("Looks like something went wrong");
    //         }
    //     }
    // }

    // console.log(articlesObj);
    // if (configuration.device == "desktop") {
    //     renderTemplate("rightSide", articlesObj, $("#rightSideArticlesContainer"));
    // } else if (configuration.device == "mobile") {
    //     renderTemplate("bottomSide", articlesObj, $("#bottomSideArticlesContainer"));
    // }
}
