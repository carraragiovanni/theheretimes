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


async function mapIdle() {
    deleteMarkers();
    
    if ($('input[name=language]:checked').val() == "auto") {
        await getLanguage();
        $('#language-input-auto').text(localStorage.getItem('language'));
    }

    return await axios({
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        url: `/cities?north=${boundsWithMargin.north}&south=${boundsWithMargin.south}&west=${boundsWithMargin.west}&east=${boundsWithMargin.east}&maxRows=3&lang=${language}}`,
    }).then(function (response) {
        debugger;
        response.data.cities.geonames.forEach(function (newCity) {
            addMarker(newCity);
        });
    });
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
async function initMap() {
    let options = {
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        center: {
            lat: parseFloat(localStorage.getItem('lat')),
            lng: parseFloat(localStorage.getItem('lng'))
        },
        zoom: 8,
    }

    map = await new google.maps.Map($('#map')[0], options);

    map.addListener('idle', function () {
        updateBounds();
        mapIdle();
    });
    
    map.addListener('dragstart', function () {
        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").hide();
            $("#bottomSide").hide();
        }
        if (settingsOpen) {
            $(".mobile-settings-container").css("display", "none");
            settingsOpen = false;
        }
    });
}

function updateBounds() {
    bounds = {
        north: map.getBounds().getNorthEast().lat(),
        south: map.getBounds().getSouthWest().lat(),
        east: map.getBounds().getNorthEast().lng(),
        west: map.getBounds().getSouthWest().lng()
    }
    boundsWithMargin = {
        north: bounds.north - (bounds.north - bounds.south) * 0.2,
        south: bounds.south + (bounds.north - bounds.south) * 0.2,
        east: bounds.east + (bounds.west - bounds.east) * 0.2,
        west: bounds.west - (bounds.west - bounds.east) * 0.2
    }
}

async function addMarker(city) {
    let marker = new google.maps.Marker({
        position: {
            lat: city.lat,
            lng: city.lng
        },
        map: map
    });
    
    markers.push(marker);
    
    marker.addListener('click', async function () {
        if (localStorage.getItem('device') == 'desktop') {
            rightSideOpen = true;
        } else {
            bottomSideOpen = true;
        }
        if (settingsOpen) {
            $(".mobile-settings-container").css("display", "none");
            settingsOpen = false;
        }
        sideRightOpenAndParse(city);
        openCityGeonameId = city.geonameId;
    });
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    setMapOnAll(null);
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
        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").hide();
            $("#bottomSide").hide();
        }
        map.fitBounds(bounds);
    });
}

async function sideRightOpenAndParse(city) {
    if (localStorage.getItem('device') == 'desktop') {
        $("#rightSide").show();
        rightSideOpen = true;
        renderTemplate("rightSideTitle", city.name, $("#rightSide"));
    } else if (localStorage.getItem('device') == "mobile") {
        $("#bottomSide").show();
        bottomSideOpen = true;
        renderTemplate("bottomSideTitle", city.name, $("#bottomSide"));
    }

    let articles = await getArticles(city);
    // if (articles.length != 0) {
        if (localStorage.getItem('device') == "desktop") {
            renderTemplate("rightSide", articles, $("#rightSideArticlesContainer"));
        } else if (localStorage.getItem('device') == "mobile") {
            renderTemplate("bottomSide", articles, $("#bottomSideArticlesContainer"));
        }
    // } else {
        // console.log("0 articles");
        // renderTemplate("bottomSide", articles = { title: "banana" }, $("#bottomSideArticlesContainer"));
    // }
}

async function getArticles(city) {
    var dateFrom = moment().subtract(localStorage.getItem('daysSincePublished'), "days").format("YYYY-MM-DD");
    return await axios({
        method: 'GET',
        url: `/articles?q=${city.name}&lang=${localStorage.getItem('language')}&from=${dateFrom}&sortBy=${localStorage.getItem('sortBy')}`,
    }).then(function (response) {
        return response.data.articles.articles;
    });
}

function checkMatchingArticles(exisitingArticles) {
    for (exisitingArticle of exisitingArticles) {
        if (exisitingArticle.language == configuration.language) {
            if (exisitingArticle.sortBy == configuration.sortBy) {
                if (exisitingArticle.publishedSince == configuration.publishedSince) {
                    if (moment().subtract(15, 'second').isBefore(exisitingArticle.downloadedAt)) {
                        return exisitingArticle;
                    }
                }
            }
        } 
    }
}

function createIDBArticles(articles, city) {
    let article = {
        city_id: city.id,
        geonameId: city.geonameId,
        publishedSince: configuration.publishedSince,
        sortBy: configuration.sortBy,
        articles: articles,
        language: configuration.language,
        downloadedAt: moment().toISOString()
    }
    return article;
}
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
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
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

this["JST"]["logIn"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"log-in-window\">\n    <i id=\"close-icon-sign-up-login\" class=\"material-icons\" onclick=\"closeSignInWindow()\">close</i>\n    <div>\n        <input type=\"text\" id=\"email\" name=\"email\" placeholder=\"Email\" />\n        <input type=\"password\" id=\"password\" name=\"password\" placeholder=\"Password\" />\n    </div>\n    <div class=\"flexbox-center\">\n        <button id=\"#log-in\">Log In</button>\n        <button id=\"#forgot-password\">Forgot Password</button>\n    </div>\n</div>";
},"useData":true});

this["JST"]["myLocations"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "            <option value=\"relevancy\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"my-locations\">\n    <div class=\"flexbox\">\n\n    <select name=\"my-locations\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </select>\n        <a id=\"add-location\" data-toggle=\"tooltip\" title=\"add current location to your favorie locations\">+</a>\n    </div>\n</div>";
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
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["rightSideTitle"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row\">\n    <div class=\"flexbox right-side-title\">\n        <div id=\"city-name\">\n            <h4>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</h4>\n        </div>\n        <a class=\"close-icon\" onclick=\"closeRightBottom()\">x</a>\n    </div>\n</div>\n\n<div id=\"rightSideArticlesContainer\">\n</div>";
},"useData":true});

this["JST"]["signUp"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"log-in-sign-up-window\" class=\"forms\">\n    <ul class=\"tab-group\">\n        <li id=\"log-in-tab\" class=\"tab\"><a data-id=\"login\">Log In</a></li>\n        <li id=\"sign-up-tab\" class=\"tab active\"><a data-id=\"signup\">Sign Up</a></li>\n    </ul>\n    <div id=\"log-in-window\">\n        <form action=\"#\" id=\"login\">\n            <div class=\"credentials-input-field\">\n                <label for=\"email\">Email</label>\n                <input id=\"emailLogIn\" type=\"email\" name=\"email\" required=\"email\"  autocomplete=\"email username\"/>\n                <label for=\"password\">Password</label>\n                <input id=\"passwordLogIn\" type=\"password\" name=\"password\" autocomplete=\"current-password\" required/>\n                <input id=\"logIn\" type=\"button\" value=\"Login\" class=\"button\" />\n                <p class=\"text-p\"> <a href=\"#\">Forgot password?</a> </p>\n            </div>\n        </form>\n    </div>\n    <div id=\"sign-up-window\">\n        <form action=\"#\" id=\"signup\">\n            <div class=\"credentials-input-field\">\n                <label for=\"email\">Email</label>\n                <input id=\"emailSignUp\" type=\"email\" name=\"email\" required=\"email\" autocomplete=\"email username\"/>\n                <label for=\"password\">Password</label>\n                <input id=\"passwordSignUp\" type=\"password\" name=\"password\" autocomplete=\"new-password\" required />\n                <label for=\"password\">Confirm Password</label>\n                <input type=\"password\" name=\"password\" autocomplete=\"new-password\" required />\n                <input id=\"signUp\" type=\"button\" value=\"Sign up\" class=\"button\"/>\n            </div>\n        </form>\n    </div>\n</div>";
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