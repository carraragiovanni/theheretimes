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