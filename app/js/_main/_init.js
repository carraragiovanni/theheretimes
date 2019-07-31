let bounds;
let boundsWithMargin;
var markers = [];
let openCityGeonameId;
let rightSideOpen = false;
let bottomSideOpen = false;
let settingsOpen = false;
let latitude = 0;
let longitude = 0;
let map;
let language = 'en'

$(document).ready(function () {
    initMap();
    initSettings();
    initAutocomplete();
});


function initSettings() {
    if (localStorage.getItem('visited') === 'true') {
        //2+visit
        $(`input:radio[name=language][value=${localStorage.getItem('language')}]`).attr('checked', true);
        $('input[name=days-since-published]').val(localStorage.getItem('daysSincePublished'));
        $('#days-since-published-input').text(localStorage.getItem('daysSincePublished'));
        $('select[name=sort-by]').val(localStorage.getItem('sortBy'));
    } else {
        //firstvisit
        localStorage.setItem('sortBy', 'relevancy');
        localStorage.setItem('languageSelection', 'en');
        localStorage.setItem('daysSincePublished', 12);
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