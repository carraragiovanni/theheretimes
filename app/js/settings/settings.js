async function initSettings() {
    await forageLocalStorage();
    initSettingsPanel();

    $('#language-selector').on("change", async function () {
        configuration.languageInput = $(this).val();
        await getLanguage();
        setLocalStorage(configuration);
        clearOverlays();
        $("#rightSide").hide();
        google.maps.event.trigger(map, 'idle');
    });

    $("#sort-by-selector").on("change", async function () {
        configuration.sortBy = $(this).val();
        setLocalStorage(configuration);
        clearOverlays();
        $("#rightSide").hide();
        google.maps.event.trigger(map, 'idle');
    });
}

function initSettingsPanel() {
    renderTemplate("settingsPanel", null, $("#settingsPanel"));
    
    setCenter()

    $('.collapsible').collapsible();
    initSlider();
    $('#language-selector').val(configuration.languageInput);
    $('#language-selector').formSelect();
    $('#sort-by-selector').val(configuration.sortBy);
    $('#sort-by-selector').formSelect();
}

function setCenter() {
    if (configuration.mapSettings.location.lat == 0) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(pos);
                configuration.mapSettings.location.lat = pos.lat;
                configuration.mapSettings.location.lng = pos.lng;
            });
        }
    } else {
        let pos = {
            lat: configuration.mapSettings.location.lat,
            lng: configuration.mapSettings.location.lng
        };
        map.setCenter(pos);
        map.setZoom(configuration.mapSettings.zoom);
    }
}

function initSlider() {
    slider = document.getElementById('date-slider');
    noUiSlider.create(slider, {
        start: [7],
        step: 1,
        range: {
            'min': [1],
            'max': [30]
        },
        format: wNumb({
            decimals: .1
        })
    });

    slider.noUiSlider.on("set", function () { 
        configuration.publishedSince = Math.round(slider.noUiSlider.get());
        setLocalStorage(configuration);
        clearOverlays();
        $("#rightSide").hide();
        resetCities();
    });
}

async function getLanguage() {
    if (configuration.languageInput != "auto") {
        configuration.language = configuration.languageInput;
        setLocalStorage(configuration);
    } else {
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
}

function resetCities() {
    clearOverlays();
    google.maps.event.trigger(map, 'idle');
    $("#rightSide").hide();
    rightSideOpen = false;
}