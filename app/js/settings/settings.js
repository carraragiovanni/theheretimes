async function initLanguageSettings() {
    if (localStorage.getItem('languageSelection') == 'auto') {
        getLanguage();
    }
    
    $(`input:radio[name=language][value=${localStorage.getItem('languageSelection')}]`).attr('checked', true);
    
    $("input:radio[name=language]").change(async function () {
        localStorage.setItem('language', $(this).val());
        
        if ($(this).val() == 'auto') {
            await getLanguage();
        } else {
            $('#language-input-auto').empty();
        }
        
        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").hide();
            $("#bottomSide").hide();
        }
    });
}

function initDaysSincePublishedSettings() {    
    $('#days-since-published-input').text(localStorage.getItem('daysSincePublished'));
    $('input[name=days-since-published]').val(localStorage.getItem('daysSincePublished'));
    
    $('input[name=days-since-published]').on("input", function () {
        localStorage.setItem('daysSincePublished', parseInt($(this).val()));
        $('#days-since-published-input').text($(this).val());
        
        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").hide();
            $("#bottomSide").hide();
        }
    });
}

function initSortBySettings() {
    $('select[name=sort-by]').val(localStorage.getItem('sortBy'));
    
    $('select[name=sort-by]').on("input",  function () {
        localStorage.setItem('sortBy', $(this).val());
        
        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").hide();
            $("#bottomSide").hide();
        }
    });
}

async function getLanguage() {
    return await axios({
        method: 'GET',
        url: `/language?lat=${localStorage.getItem('lat')}&lng=${localStorage.getItem('lng')}`,
    }).then(async function (response) {
        if (response.data.language.status == "ZERO_RESULTS") {
            localStorage.setItem('language', 'en');
        } else if (_.contains(response.data.language.results[response.data.language.results.length - 1].types, "country")) {
            country = response.data.language.results[response.data.language.results.length - 1].formatted_address;
            if (country.slice(country.length - 3) == "USA") {
                country = "United States";
            }
            return await axios({
                method: 'get',
                url: "json/countries.json"
            }).then(function (data) {
                language = _.findWhere(data.data, {name: country}).languages[0];
                localStorage.setItem('language', language);
            });
        }
    });
}
