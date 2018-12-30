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
async function mapIdle() {
    let citiesToMap = [];
    
    if (configuration.languageInput == "auto") {
        await autoLanguage();
    }
    
    let existingCitiesInIDB = await getCitiesInBoundsinIDB(bounds);
    
    
    existingCitiesInIDB.forEach(function (city) {
        if (city.lat < bounds.north && city.lat > bounds.south && city.lng < bounds.east && city.lng > bounds.west) {
            if (city.language == configuration.language) {
                citiesToMap.push(city);
            }
        }
    });
    
    async function asyncCreation(newCities) {
        for await (const city of newCities) {
            let citytoAdd = createIDBObject(city);
    
            if (!_.findWhere(citiesToMap, {"geonameID": citytoAdd.geonamesID})) {
                db.cities.put(citytoAdd);
                citiesToMap.push(citytoAdd);
            }
        }
    }
    
    if (citiesToMap.length < 3) {
        let newCities = await getCitiesInBoundsGeonames(3 - citiesToMap.length);
        await asyncCreation(newCities);
    } else {
        citiesToMap = reduceSortCities(citiesToMap);
    }

    console.log(citiesToMap);
    
    citiesToMap.forEach(function (city) {
        addMarkerandInfoWindow(citiesToMap, city);
    });
}

function reduceSortCities(citiesToMap) {
    citiesToMap = _.sortBy(citiesToMap, 'population').reverse();
    citiesToMap = citiesToMap.slice(0, 3);
    return citiesToMap;
}

const db = new Dexie('citiesDatabase');

db.version(1).stores({
    cities: 'id++, city, geonamesId, language, articles, articlesLastDownload'
});

async function getCitiesInBoundsinIDB() {
    return await db.cities.toArray();
}
async function getCitiesInBoundsGeonames(numberCities) {
    let username = 'carraragiovanni';

    return await axios({
        method: 'GET',
        url: `http://api.geonames.org/citiesJSON?north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}&maxRows=${numberCities}&lang=${configuration.language}&username=${username}`,
    }).then(function (response) {
        return response.data.geonames;
    });
}

function createIDBObject(geonamesCity) {
    let city = {
        name: geonamesCity.name,
        lat: geonamesCity.lat,
        lng: geonamesCity.lng,
        geonameId: geonamesCity.geonameId,
        language: configuration.language,
        population: geonamesCity.population,
        articlesObj: [],
    }

    return city;
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
function updateBoundsAndZoom(map) {
    bounds = {
        north: map.getBounds().ma.l,
        south: map.getBounds().ma.j,
        east: map.getBounds().fa.l,
        west: map.getBounds().fa.j
    }

    configuration.mapSettings.location.lat = map.getCenter().lat();
    configuration.mapSettings.location.lng = map.getCenter().lng();
    configuration.mapSettings.zoom = map.getZoom();

    setLocalStorage(configuration);
}

function initMap() {  
    let options = {
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        center: {
            lat: configuration.mapSettings.location.lat,
            lng: configuration.mapSettings.location.lng
        },
        zoom: 8,
    }
    
    map = new google.maps.Map($('#map')[0], options);
    
    map.addListener('idle', function () {
        updateBoundsAndZoom(map);

        mapIdle();
    });

    map.addListener('dragstart', function () {
        $("#customInfoWindowContainer").empty();
    })
}

async function addMarkerandInfoWindow(cities, city) {
    let marker = new google.maps.Marker({
        position: {
            lat: city.lat,
            lng: city.lng
        },
        map: map
    });

    marker.addListener('click', async function (marker) {
        addCustomInfoWindow(city);
        rightSideOpen = true;
        map.setCenter({
            lat: city.lat,
            lng: city.lng
        });
        sideRightOpenAndParse(city);
        openCity = city.id;
    });
}

function addCustomInfoWindow(city) {
    renderTemplate("customInfoWindow", city.name, $("#customInfoWindowContainer"));
    $("#customInfoWindowContainer").css("top", (((window.innerHeight) / 2) - ($("#customInfoWindowContainer").height() / 2) + (60)));
    $("#customInfoWindowContainer").css("left", (((window.innerWidth) / 2) - ($("#customInfoWindowContainer").width() / 2)));
}

function clearOverlays() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
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
    
    let datePublishedSince = moment().subtract(configuration.publishedSince, "days").toISOString();

    return await axios({
        method: 'get',
        url: `https://newsapi.org/v2/everything?q=${city.name}&language=${configuration.language}&from=${datePublishedSince}&sortBy=${configuration.sortBy}&apiKey=${apiKeyNewsAPI}`,
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

async function writeConfigurationFile() {
    return await axios.get("configuration.json").then(function (data) {
        localStorage.setItem('configuration', JSON.stringify(data.data));
        configuration = data.data;
    });
}

function getLocalStorage() {
    configuration = JSON.parse(localStorage.getItem('configuration'));
}

async function setLocalStorage(configuration) {
    return await localStorage.setItem('configuration', JSON.stringify(configuration));
}

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

function getUserLocation() {
    let promise = $.Deferred();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            configuration.mapSettings.location.lat = pos.lat;
            configuration.mapSettings.location.lng = pos.lng;
            setLocalStorage(configuration);
            return promise.resolve();
        });
    } else {
        firstVisitGeolocationBlocked();
    }
    return promise.promise();
}

var optionsGeolocation = {
    enableHighAccuracy: true,
    timeout: 100000,
    maximumAge: 0
};

function errorGeolocation(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function firstVisitGeolocationBlocked() {
    var location = prompt("Location: ");
    alert("navigate to city");
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

this["JST"]["customInfoWindow"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div>\n    <h4>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</h4>\n</div>";
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