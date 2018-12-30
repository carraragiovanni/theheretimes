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
