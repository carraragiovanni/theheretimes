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