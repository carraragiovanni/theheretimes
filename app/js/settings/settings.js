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
    });
}

async function getLanguage() {
    return await axios({
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${map.center.lat()},${map.center.lng()}&key=AIzaSyAEzitfRh4g-BFpcT8aoQwpZL-FytTNqqQ`,
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
