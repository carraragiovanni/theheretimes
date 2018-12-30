let configuration = {};
let map;
let bounds;
let cities = [];
let markers = [];
let openCity = null;
let rightSideOpen = false;
let cityIndex = 0;
let cityID = 0;

$(document).ready(async function () {
    if (JSON.parse(localStorage.getItem('configuration')) == null) {
        // FIRST VISIT
        
        await writeConfigurationFile();
        
        initSettings();

        navigator.permissions.query({
            name: 'geolocation'
        }).then(function (PermissionStatus) {
            if (PermissionStatus.state == "granted") {
                initMapComponents();
            }
            getUserLocation().then(function() {
                initMapComponents();
            });
        });
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
    initLayout();
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
    } else {
        configuration.device = "desktop";
    }

    $("#theHereTimesLogo").css("left", (window.outerWidth / 2) - ($("#theHereTimesLogo").width() / 2));
    
    setLocalStorage(configuration);
}