function initMapComponents() {
    initMap();
    initAutocomplete();
}

function updateBoundsAndZoom() {
    // debugger;
    bounds = {
        north: map.getBounds().na.l,
        south: map.getBounds().na.j,
        east: map.getBounds().ia.l,
        west: map.getBounds().ia.j
    }
    boundsWithMargin = {
        north: bounds.north - (bounds.north - bounds.south) * 0.2,
        south: bounds.south + (bounds.north - bounds.south) * 0.2,
        east: bounds.east + (bounds.west - bounds.east) * 0.2,
        west: bounds.west - (bounds.west - bounds.east) * 0.2
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