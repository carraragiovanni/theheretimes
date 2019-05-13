let configuration = {};
let map;
let bounds;
let boundsWithMargin;
var markers = [];
let openCityGeonameId;
let rightSideOpen = false;
let bottomSideOpen = false;
let settingsOpen = false;

$(document).ready(async function () {
    if (JSON.parse(localStorage.getItem('configuration')) == null) {
        // FIRST VISIT
        await writeConfigurationFile();
    
        initSettings();

        initMapComponents();

        async function success(position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            console.log(latitude);
            console.log(longitude);
            map.setCenter(new google.maps.LatLng(latitude, longitude));
        }
    
        function error() {
            status.textContent = 'Unable to retrieve your location';
        }

        if (!navigator.geolocation) {
            status.textContent = 'Geolocation is not supported by your browser';
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    } else {
        // NOT FIRST VISIT
        
        getLocalStorage();
        initSettings();
        initMapComponents();
    }
});

function initSettings() {
    initLanguageSettings();
    initDaysSincePublishedSettings();
    initSortBySettings();
    initLayout();
    initUserLogin();
}

function initMapComponents() {
    initMap();
    initAutocomplete();
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
}

function resizeScreen() {
    if (window.outerWidth <= 576) {
        configuration.device = "mobile";
        configureMobileLayout();
    } else {
        configuration.device = "desktop";
    }

    $("#theHereTimesLogo").css("left", (window.innerWidth / 2) - ($("#theHereTimesLogo").width() / 2));
    
    setLocalStorage(configuration);
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