let configuration = {};
let map;
let bounds;
let cities = [];
let markers = [];
let infoWindows = [];
var slider = null;
let openCity = null;
let rightSideOpen = false;
let cityIndex = 0;
let cityID = 0;

$(document).ready(function () {
    // SETUP
    initMap();
    initSettings();
    initLayout();
    initAutocomplete();
});

async function initLayout() {
    await forageLocalStorage();

    if (window.outerWidth <= 576) {
        configuration.device = "mobile";
        addMobileSettingMenu();
    } else {
        configuration.device = "desktop"
        $("#theHereTimesLogo").css("left", (window.outerWidth / 2) - ($("#theHereTimesLogo").width() / 2));
    }
}

function addMobileSettingMenu() {
    $("body").append(`<div id="mobileSettingsMenu"><i class="material-icons">menu</i></div>`);
    $("#settingsPanel").addClass("hidden");
    $("#settingsPanel").css("z-index", "0");

    $("#mobileSettingsMenu").on("click", function() {
        if ($("#settingsPanel").hasClass("hidden")) {
            $("#settingsPanel").removeClass("hidden");
            $("#settingsPanel").css("z-index", "100");
        } else {
            $("#settingsPanel").addClass("hidden");
            $("#settingsPanel").css("z-index", "0");
        }
    })
}

async function mapIdle() {
    let citiesInBoundsGeonames = await getCitiesInBoundsGeonames(bounds);

    async function asyncCreation(citiesInBoundsGeonames) {
        for await (const geonamesCity of citiesInBoundsGeonames) {
            await createIDBObject(geonamesCity);
        }
    }

    await asyncCreation(citiesInBoundsGeonames);
    
    let cities = await getCitiesInBoundsinIDB(bounds);

    await getLanguage();

    let languageCities = _.filter(cities, function (city) {
        return city.language == configuration.language;
    });

    languageCities.forEach(async function (city) {
        addMarkerandInfoWindow(city);
    });
}

async function getCitiesInBoundsinIDB(bounds) {
    let cities = await db.cities.toArray();
    let citiesInBounds = [];
    cities.forEach(function(city) {
        if (city.lng <= bounds.east && city.lng >= bounds.west) {
            if (city.lat <= bounds.north && city.lat >= bounds.south) {
                citiesInBounds.push(city);
            }
        }
    });
    return citiesInBounds;
}
