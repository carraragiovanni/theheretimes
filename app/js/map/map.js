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
        if (rightSideOpen || bottomSideOpen) {
            $("#rightSide").hide();
            $("#bottomSide").hide();
        }
        if (settingsOpen) {
            $(".mobile-settings-container").css("display", "none");
            settingsOpen = false;
        }
    })
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
        if (configuration.device == "desktop") {
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