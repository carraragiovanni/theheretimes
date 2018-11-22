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

const db = new Dexie('citiesDatabase');

db.version(1).stores({
    cities: 'id++, city, geonamesId, language, articles, articlesLastDownload'
});



async function getCitiesInBoundsGeonames(bounds) {
    let username = 'carraragiovanni';
    await getLanguage();

    return await axios({
        method: 'get',
        url: `http://api.geonames.org/citiesJSON?north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}&maxRows=2&lang=${configuration.language}&username=${username}`,
    }).then(function (response) {
        return response.data.geonames;
    });
}

async function createIDBObject(geonamesCity) {
    await getLanguage();

    let city = {
        name: geonamesCity.name,
        lat: geonamesCity.lat,
        lng: geonamesCity.lng,
        geonameId: geonamesCity.geonameId,
        language: configuration.language,
        articlesObj: [],
    }

    await putIDBNewCity(city);
}

async function putIDBNewCity(city) {
    let cities = await db.cities.toArray();
    let existingCities = _.where(cities, {geonameId: city.geonameId});
    let languages = [];
    if (existingCities != null) {
        existingCities.forEach(async function (existingCityfromArray) {
            languages.push(existingCityfromArray.language);
        });
        if (!_.contains(languages, city.language)) {
            db.cities.put(city);
        }
    }
}

function renderTemplate(templateName, data, container) {
    if (!data) {
        data = {}
    }
    container.html("");
    let t = JST[templateName];
    let h = t(data);
    container.html(h);
}

Handlebars.registerHelper('extractDomain', function (url) {
    return url.split("/")[2];
});

Handlebars.registerHelper('parsePublishetAtDate', function (publishedAt) {
    return moment(publishedAt).format("L");
});
function initMap() {    
    let options = {
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 8,
        styles: [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            },
            {
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#bdbdbd"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "poi.business",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ffffff"
                }]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dadada"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "featureType": "road.local",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            },
            {
                "featureType": "transit",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#c9c9c9"
                }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            }
        ]
    }
    
    map = new google.maps.Map($('#map')[0], options);
    
    map.addListener('idle', function () {
        bounds = {
            north: map.getBounds().l.l,
            south: map.getBounds().l.j,
            east: map.getBounds().j.l,
            west: map.getBounds().j.j
        }

        configuration.mapSettings.location.lat = map.getCenter().lat();
        configuration.mapSettings.location.lng = map.getCenter().lng();
        configuration.mapSettings.zoom = map.getZoom();

        setLocalStorage(configuration);

        mapIdle();
    });

}

async function addMarkerandInfoWindow(city) {
    let cities = await db.cities.toArray();
    let marker = new google.maps.Marker({
        position: {
            lat: city.lat,
            lng: city.lng
        },
        map: map
    });
    
    markers.push(marker);
    _.findWhere(cities, {id: city.id}).marker = marker;
    
    let contentString = '<div class="infoWindowContainerCustom">' +
        `<div id="content" data-id=${city.id}>` +
        `<div id="siteNotice">` +
        `</div>` +
        `<h4 id="firstHeading" class="firstHeading">${city.name}</h4>` +
        `<div id="bodyContent">` +
        `</div>` +
        `</div>` +
        `</div>`;
    
    let infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

    infoWindows.push(infoWindow);

    _.findWhere(cities, {id: city.id}).infoWindow = infoWindow;

    marker.addListener('click', async function () {
        rightSideOpen = true;
        map.setCenter({
            lat: city.lat,
            lng: city.lng
        });
        infoWindows.forEach(function(infoWindow) {
            infoWindow.close();
        })
        infoWindow.open(map, marker);
        sideRightOpenAndParse(city);
        openCity = city.id;
    });

    infoWindow.addListener('closeclick', function () {
        $("#rightSide").hide();
        rightSideOpen = false;
    });
}

function clearOverlays() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    
    for (var i = 0; i < infoWindows.length; i++) {
        infoWindows[i].setMap(null);
    }
}

function getBounds() {
    bounds = {
        north: map.getBounds().l.l,
        south: map.getBounds().l.j,
        east: map.getBounds().j.l,
        west: map.getBounds().j.j
    }
    return bounds;
}

function initAutocomplete() {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

async function newsAPI(city) {
    let apiKeyNewsAPI = '22f8d579867948f991198b333b9a967d';
    // let apiKeyNewsAPI = 'ba114202f6c04b70a953c0624e570b51';
    // let apiKeyNewsAPI = 'cc3709c07a28493ba67d4baf15857ded';
    let language = configuration.language;
    let datePublishedSince = calendarDaySincePublished();

    return await axios({
        method: 'get',
        url: `https://newsapi.org/v2/everything?q=${city.name}&language=${language}&from=${datePublishedSince}&sortBy=${configuration.sortBy}&apiKey=${apiKeyNewsAPI}`,
    }).then(async function (response) {
        articleObj = {
            articles: response.data.articles,
            articlesLanguage: configuration.language,
            articlesLastDownload: moment().toISOString(),
            publishedSince: configuration.publishedSince,
            sortBy: configuration.sortBy
        };
        city.articlesObj.push(articleObj);
        await db.cities.put(city);
        return city;
    });
}

function calendarDaySincePublished() {
    return moment().subtract(configuration.publishedSince, "days").toISOString();
}
async function sideRightOpenAndParse(city) {
    if (configuration.device == "desktop") {
        $("#rightSide").show();
        rightSideOpen = true;
        renderTemplate("rightSideTitle", city.name, $("#rightSide"));
    } else if (configuration.device == "mobile") {
        $("#bottomSide").show();
        bottomSideOpen = true;
        renderTemplate("bottomSideTitle", city.name, $("#bottomSide"));
    }
    let fiveMins = moment().subtract(6, "hours");
    let articleObj = null;
    
    if (city.articlesObj.length <= 0) {
        city = await newsAPI(city);
    } else {
        for (let element of city.articlesObj) {
            if (element.articlesLanguage == configuration.language && element.publishedSince == configuration.publishedSince && element.sortBy == configuration.sortBy && moment(element.articlesLastDownload).isAfter(fiveMins)) {
                console.log("Article with these params exists");
                articleObj = element;
            } else {
                city = await newsAPI(city);
            }
        };
    }

    let articlesObj = city.articlesObj;

    let articlesLanguage = _.where(articlesObj, {articlesLanguage: configuration.language});
    if (articlesLanguage.length == 1) {
        articlesObj = articlesLanguage[0];
    } else {
        let articlesPublishedSince = _.where(articlesLanguage, {publishedSince: configuration.publishedSince});
        if (articlesPublishedSince.length == 1) {
            articlesObj = articlesPublishedSince[0];
        } else {
            let articlesSortBy = _.where(articlesPublishedSince, {sortBy: configuration.sortBy});
            if (articlesSortBy.length == 1) {
                articlesObj = articlesSortBy[0];
            } else {
                console.log("Looks like something went wrong");
            }
        }
    }
    if (configuration.device == "desktop") {
        renderTemplate("rightSide", articlesObj, $("#rightSideArticlesContainer"));
    } else if (configuration.device == "mobile") {
        renderTemplate("bottomSide", articlesObj, $("#bottomSideArticlesContainer"));
    }
}

function forageLocalStorage() {
    if (localStorage.getItem('configuration')) {
        configuration = JSON.parse(localStorage.getItem('configuration'));
    } else {
        axios.get("configuration.json").then(function (data) {
            localStorage.setItem('configuration', JSON.stringify(data.data));
            configuration = data.data;
        });
    }
}

function setLocalStorage(configuration) {
    localStorage.setItem('configuration', JSON.stringify(configuration));
}

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
this["JST"] = this["JST"] || {};

this["JST"]["bottomSide"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "    <div class=\"article row\">\n        <div class=\"col s2 valign-wrapper\">\n            <img class=\"website-icon\" src=\"//logo.clearbit.com/"
    + alias3((helpers.extractDomain || (depth0 && depth0.extractDomain) || alias2).call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"extractDomain","hash":{},"data":data}))
    + "\">\n        </div>\n        <div class=\"col s10\">\n            <a href=\""
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n            <p>"
    + alias3((helpers.parsePublishetAtDate || (depth0 && depth0.parsePublishetAtDate) || alias2).call(alias1,(depth0 != null ? depth0.publishedAt : depth0),{"name":"parsePublishetAtDate","hash":{},"data":data}))
    + "</p>\n        </div>\n    </div>\n    <div class=\"divider\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"articlesBottom\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.articles : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["bottomSideTitle"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row\">\n    <div class=\"col s10\" id=\"city-name\">\n        <h4>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</h4>\n    </div>\n    <div class=\"col s2 valign-wrapper\">\n        <a onclick=\"closeRightBottom()\">\n            <i id=\"close-icon-bottomSide\" class=\"material-icons\">close</i>\n        </a>\n    </div>\n</div>\n<div id=\"bottomSideArticlesContainer\">\n</div>";
},"useData":true});

this["JST"]["rightSide"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "    <div class=\"article row\">\n        <div class=\"col s2 valign-wrapper\">\n            <img class=\"website-icon\" src=\"//logo.clearbit.com/"
    + alias3((helpers.extractDomain || (depth0 && depth0.extractDomain) || alias2).call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"extractDomain","hash":{},"data":data}))
    + "\">\n        </div>\n        <div class=\"col s10\">\n            <a href=\""
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n            <p>"
    + alias3((helpers.parsePublishetAtDate || (depth0 && depth0.parsePublishetAtDate) || alias2).call(alias1,(depth0 != null ? depth0.publishedAt : depth0),{"name":"parsePublishetAtDate","hash":{},"data":data}))
    + "</p>\n        </div>\n    </div>\n    <div class=\"divider\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"articlesRight\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.articles : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["rightSideTitle"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row\">\n    <div class=\"col s10\" id=\"city-name\">\n        <h4>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</h4>\n    </div>\n    <div class=\"col s2 valign-wrapper\">\n        <a onclick=\"closeRightBottom()\">\n            <i id=\"close-icon-rightSide\" class=\"material-icons\">close</i>\n        </a>\n    </div>\n</div>\n<div id=\"rightSideArticlesContainer\">\n</div>";
},"useData":true});

this["JST"]["settingsPanel"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<ul class=\"collapsible\">\n    <li>\n        <div class=\"collapsible-header\"><i class=\"material-icons\">language</i>Language</div>\n            <div class=\"collapsible-body\">\n                <select id=\"language-selector\">\n                    <option value=\"auto\">Auto Detect</option>\n                    <option value=\"en\">English</option>\n                    <option value=\"es\">Spanish</option>\n                    <option value=\"de\">German</option>\n                    <option value=\"it\">Italian</option>\n                </select>\n            </div>\n        </div>\n    </li>\n    <li>\n        <div class=\"collapsible-header\"><i class=\"material-icons\">date_range</i>Days Since Published</div>\n            <div class=\"collapsible-body\">\n                <div id=\"date-slider\"></div>\n            </div>\n        </div>\n    </li>\n    <li>\n        <div class=\"collapsible-header\"><i class=\"material-icons\">sort</i>Sort By</div>\n            <div class=\"collapsible-body\">\n                <select id=\"sort-by-selector\">\n                    <option value=\"publishedAt\">Published At</option>\n                    <option value=\"relevancy\">Relevancy</option>\n                    <option value=\"popularity\">Popularity</option>\n                </select>\n            </div>\n        </div>        \n    </li>\n</ul>\n";
},"useData":true});
function renderTemplate(templateName, data, container) {
    if (!data) {
        data = {}
    }
    container.html("");
    let t = JST[templateName];
    let h = t(data);
    container.html(h);
}

function closeRightBottom() {
    $(".articlesContainer").hide();
}