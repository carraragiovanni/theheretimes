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
