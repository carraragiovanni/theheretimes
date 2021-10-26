let bounds;
let boundsWithMargin;
var markers = [];
let openCityGeonameId;
let rightSideOpen = false;
let bottomSideOpen = false;
let settingsOpen = false;
let map;
let language = 'en'

$(document).ready(async function () {
    await initMap();
    initSettings();
    initAutocomplete();
});

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter({lat: pos.lat, lng: pos.lng});
            localStorage.setItem('lat', pos.lat);
            localStorage.setItem('lng', pos.lng);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {

        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    alert("error")
}


async function initSettings() {
    if (localStorage.getItem('visited') === 'true') {
        //2+visit
        $(`input:radio[name=language][value=${localStorage.getItem('language')}]`).attr('checked', true);
        $('input[name=days-since-published]').val(localStorage.getItem('daysSincePublished'));
        $('#days-since-published-input').text(localStorage.getItem('daysSincePublished'));
        $('select[name=sort-by]').val(localStorage.getItem('sortBy'));
        $('select[name=my-locations]').val(localStorage.getItem('myLocations'));
        map.setCenter({ lat: parseFloat(localStorage.getItem('lat')), lng: parseFloat(localStorage.getItem('lng')) });
        map.setZoom(parseInt(localStorage.getItem('zoom')));
    } else {
        //firstvisit
        localStorage.setItem('sortBy', 'relevancy');
        localStorage.setItem('languageSelection', 'auto');
        localStorage.setItem('daysSincePublished', 12);
        await getUserLocation();
    }
    
    initLanguageSettings();
    initDaysSincePublishedSettings();
    initSortBySettings();
    initLayout();
    
    localStorage.setItem('visited', true);
}

function initLayout() {
    resizeScreen();
    
    if (window.attachEvent) {
        window.attachEvent('onresize', function () {
            resizeScreen();
        });
    } else if (window.addEventListener) {
        window.addEventListener('resize', function () {
            resizeScreen();
        }, true);
    } else {
        //The browser does not support Javascript event binding
    }    

    // $("#user-location").click(function() {
    //     getUserLocation();
    // })
}

function resizeScreen() {
    if (window.outerWidth <= 576) {
        localStorage.setItem('device', 'mobile');
        configureMobileLayout();
    } else {
        localStorage.setItem('device', 'desktop');
    }
    
    $("#theHereTimesLogo").css("left", (window.innerWidth / 2) - ($("#theHereTimesLogo").width() / 2));
}

function configureMobileLayout() { 
    $("#settings-container-desktop").addClass("mobile-settings-container");
    
    $(`<i id="mobile-x" class="large material-icons">settings</i>`).insertAfter("#settings-container-desktop");
    
    $("#mobile-x").on("click", function () {
        if (settingsOpen == false) {
            $(".mobile-settings-container").css("display", "block");
            settingsOpen = true;
        } else {
            $(".mobile-settings-container").css("display", "none");
            settingsOpen = false;
        }
    });
}