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

function initMyLocations() {
    // $('select[name=my-locations]').val(localStorage.getItem('myLocations'));
    renderTemplate("myLocations", ["abc", "def"], $("#my-locations-selector"));
    
    $("#add-location").on("click", async function () {
        return await axios({
            method: 'GET',
            headers: {"Access-Control-Allow-Origin": "*"},
            url: `/cityName?lat=${parseFloat(localStorage.getItem('lat'))}&lng=${parseFloat(localStorage.getItem('lng'))}`,
        }).then(function (response) {
            let cityName = response.data.cityName.geonames[0];
            
            var db = new Dexie("myLocations");
            db.version(1).stores({
                cities: "++id, adminCode1, lng, distance, geonameId, toponymName, countryId, fcl, population, countryCode, name, fclName, adminCodes1, countryName, fcodeName, adminName1, lat, fcode"
            });
            console.log(db)
        });
    });
    
    // $('[data-toggle="tooltip"]').tooltip();
}

async function getLanguage() {
    return await axios({
        method: 'GET',
        url: `/language?lat=${localStorage.getItem('lat')}&lng=${localStorage.getItem('lng')}`,
    }).then(async function (response) {
        // debugger;
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
