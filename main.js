let configuration = {};
let map;
let bounds;
let cities = [];
let markers = [];
let openCity = null;
let rightSideOpen = false;
let bottomSideOpen = false;
let cityOpen;

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
    initSortBySettings();
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
        configureMobileLayout();
    } else {
        configuration.device = "desktop";
    }

    $("#theHereTimesLogo").css("left", (window.innerWidth / 2) - ($("#theHereTimesLogo").width() / 2));
    
    setLocalStorage(configuration);
}

function configureMobileLayout() { 
    let settingsOpen = false;
    $("#settings-container-desktop").addClass("mobile-settings-container");

    $(`<i id="mobile-x" class="large material-icons">settings</i>`).insertAfter("#settings-container-desktop");

    $("#mobile-x").on("click", function () {
        console.log(settingsOpen);
        if (settingsOpen == false) {
            $(".mobile-settings-container").css("display", "block");
            settingsOpen = true;
        } else {
            $(".mobile-settings-container").css("display", "none");
            settingsOpen = false;
        }
    });
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

    citiesToMap.forEach(function (city) {
        addMarker(citiesToMap, city);
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
        url: `https://cors-anywhere.herokuapp.com/http://api.geonames.org/citiesJSON?north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}&maxRows=${numberCities}&lang=${configuration.language}&username=${username}`,
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

Handlebars.registerHelper('parsePublishedAtDate', function (publishedAt) {
    if (publishedAt != null) {
        return moment(publishedAt).format("L");
    }
});
function initMapComponents() {
    initMap();
    initAutocomplete();
}

function updateBoundsAndZoom() {
    bounds = {
        north: map.getBounds().ma.l,
        south: map.getBounds().ma.j,
        east: map.getBounds().ga.l,
        west: map.getBounds().ga.j
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
        updateBoundsAndZoom();

        mapIdle();
    });

    map.addListener('dragstart', function () {
        if (cityOpen) {
            $("#rightSide").hide();
        }
    })
}

async function addMarker(cities, city) {
    let marker = new google.maps.Marker({
        position: {
            lat: city.lat,
            lng: city.lng
        },
        map: map
    });


    marker.addListener('click', async function (marker) {
        if (configuration.device == "desktop") {
            rightSideOpen = true;
        } else {
            bottomSideOpen = true;
        }
        map.setCenter({
            lat: city.lat,
            lng: city.lng
        });
        sideRightOpenAndParse(city);
        openCity = city.id;
    });
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
    let promise = $.Deferred();

    // let apiKeyNewsAPI = '22f8d579867948f991198b333b9a967d';
    // let apiKeyNewsAPI = 'ba114202f6c04b70a953c0624e570b51';
    let apiKeyNewsAPI = 'cc3709c07a28493ba67d4baf15857ded';
    
    let datePublishedSince = moment().subtract(configuration.publishedSince, "days").toISOString();

    await axios({
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
        return promise.resolve(articleObj);
    });
    return promise.promise();
}
async function sideRightOpenAndParse(city) {
    if (!city) {
        let cities = await getCitiesInBoundsinIDB();
        city = _.findWhere(cities, {geonameId: cityOpen});
    }

    if (configuration.device == "desktop") {
        $("#rightSide").show();
        rightSideOpen = true;
        renderTemplate("rightSideTitle", city.name, $("#rightSide"));
    } else if (configuration.device == "mobile") {
        $("#bottomSide").show();
        bottomSideOpen = true;
        renderTemplate("bottomSideTitle", city.name, $("#bottomSide"));
    }

    console.log(city)
    let newArticle = await newsAPI(city);

    if (newArticle.articles.length == 0) {
        newArticle.articles.push(
            {
                title: "Please expand your search, no results found",
                publishedAt: null
            });
    }

    if (configuration.device == "desktop") {
        renderTemplate("rightSide", newArticle, $("#rightSideArticlesContainer"));
    } else if (configuration.device == "mobile") {
        renderTemplate("bottomSide", newArticle, $("#bottomSideArticlesContainer"));
    }

    cityOpen = city.geonameId;
    // if (configuration.device == "desktop") {
    // } else if (configuration.device == "mobile") {
    //     renderTemplate("bottomSide", newArticle.articles, $("#bottomSideArticlesContainer"));
    // }

    // let sixHours = moment().subtract(6, "hours");
    // let sixSeconds = moment().subtract(6, "seconds");

    // let languageInputArticles = _.filter(city.articlesObj, {
    //     articlesLanguage: configuration.languageInput
    // });
    // let sortByArticles = _.filter(languageInputArticles, {
    //     sortBy: configuration.sortBy
    // });
    // let publishedSinceArticles = _.filter(sortByArticles, {
    //     publishedSince: configuration.publishedSince
    // });
    
    // let sorted = _.sortBy(publishedSinceArticles, function (article) {return article.publishedSince});
    // debugger;
    // if (moment(sorted[0].articlesLastDownload).isBefore(sixSeconds)) {
    //     let newArticle = await newsAPI(city);
    //     city.articlesObj = newArticle;
    //     await db.cities.put(city);
    // } else {
    //     console.log(sorted);
    // }
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

        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").empty();
            sideRightOpenAndParse();
        }
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

        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").empty();
            sideRightOpenAndParse();
        }
    });
}

async function initSortBySettings() {
    $('select[name=sort-by]').val(configuration.sortBy);
    
    $('select[name=sort-by]').on("input", function () {
        configuration.sortBy = $(this).val();

        setLocalStorage(configuration);

        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").empty();
            sideRightOpenAndParse();
        }
    });
}

async function getLanguage() {
    return await axios({
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${map.center.lat()},${map.center.lng()}&key=AIzaSyBtlcIU7KqpPYOCCyESIB8ffBDMnm3mNeI`,
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
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"article row\">\n            <a href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n            <p>"
    + alias4((helpers.parsePublishedAtDate || (depth0 && depth0.parsePublishedAtDate) || alias2).call(alias1,(depth0 != null ? depth0.publishedAt : depth0),{"name":"parsePublishedAtDate","hash":{},"data":data}))
    + "</p>\n    </div>\n    <div class=\"divider\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"articlesRight\">\n"
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
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"article row\">\n        <div class=\"col s10\">\n            <a href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n            <p>"
    + alias4((helpers.parsePublishedAtDate || (depth0 && depth0.parsePublishedAtDate) || alias2).call(alias1,(depth0 != null ? depth0.publishedAt : depth0),{"name":"parsePublishedAtDate","hash":{},"data":data}))
    + "</p>\n        </div>\n    </div>\n    <div class=\"divider\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"articlesRight\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.articles : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["rightSideTitle"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row\">\n    <div class=\"flexbox right-side-title\">\n        <div id=\"city-name\">\n            <h4>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</h4>\n        </div>\n        <a class=\"close-icon\" onclick=\"closeRightBottom()\">x</a>\n    </div>\n</div>\n\n<div id=\"rightSideArticlesContainer\">\n</div>";
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
    $("#rightSide").hide();
    $("#bottomSide").hide();
}