async function initLanguageSettings() {
    $("input[name=language]:radio").each(function(i, e) {
        if (e.value == configuration.languageInput) {
            $(this).attr("checked", true);
        }
    });

    $("input[name=language]:radio").change(async function () {
        configuration.languageInput = $(this).val();

        if ($(this).val() != "auto") {
            configuration.language = $(this).val();
            $('#language-input-auto').empty();
        } else {
            await autoLanguage();
        }

        setLocalStorage(configuration);

        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").empty();
            
            let cities = await getCitiesIDB(bounds);
            city = _.filter(cities, function (city) {return city.geonameId == openCityGeonameId});
            let cityLanguage = _.findWhere(city, {language: configuration.language});
            if (!cityLanguage) {
                let cityNewLanguage = await getCityNewLanguage(city[0].geonameId, configuration.language);
                let citytoAdd = createIDBObject(cityNewLanguage);
                db.cities.add(citytoAdd);
                sideRightOpenAndParse(citytoAdd);
            }
        } else {
            mapIdle();
        }
    });
}



async function autoLanguage() {
    await getLanguage();
    $('#language-input-auto').text(configuration.language);
}

async function initDaysSincePublishedSettings() {
    $('input[name=days-since-published]').val(configuration.publishedSince);
    $('#days-since-published-input').text(configuration.publishedSince);
    
    
    $('input[name=days-since-published]').on("input", async function () {
        configuration.publishedSince = parseInt($(this).val());
        $('#days-since-published-input').text($(this).val());

        setLocalStorage(configuration);

        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").hide();
            sideRightOpenAndParse();
        }
        mapIdle();
    });
}

async function initSortBySettings() {
    $('select[name=sort-by]').val(configuration.sortBy);
    
    $('select[name=sort-by]').on("input", function () {
        configuration.sortBy = $(this).val();

        setLocalStorage(configuration);

        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").empty();
            sideRightOpenAndParse();
        }
    });
}

async function getLanguage() {
    return await axios({
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${map.center.lat()},${map.center.lng()}&key=AIzaSyBtlcIU7KqpPYOCCyESIB8ffBDMnm3mNeI`,
    }).then(async function (response) {
        if (response.data.status == "ZERO_RESULTS") {
            configuration.language = "en"
        } else if (_.contains(response.data.results[response.data.results.length - 1].types), "country") {
            configuration.country = response.data.results[response.data.results.length - 1].formatted_address;
            setLocalStorage(configuration);
            return await axios({
                method: 'get',
                url: "app/assets/json/countries.json"
            }).then(function (data) {
                configuration.language = _.findWhere(data.data, {name: configuration.country}).languages[0];
                setLocalStorage(configuration);
            });
        }
    });
}
