function getCitiesLanguage(existingCitiesInIDB) {
    let cities = [];
    existingCitiesInIDB.forEach(function (city) {
        if (city.language == configuration.language) {
            cities.push(city);
        }
    });
    return cities;
}

async function mapIdle() {
    localStorage.setItem('lat', map.getCenter().lat());
    localStorage.setItem('lng', map.getCenter().lng());
    localStorage.setItem('zoom', map.getZoom());
    deleteMarkers();
    
    if ($('input[name=language]:checked').val() == "auto") {
        await getLanguage();
        $('#language-input-auto').text(localStorage.getItem('language'));
    }

    return await axios({
        method: 'GET',
        url: `/cities?north=${boundsWithMargin.north}&south=${boundsWithMargin.south}&west=${boundsWithMargin.west}&east=${boundsWithMargin.east}&maxRows=3&lang=${language}}`,
    }).then(function (response) {
        response.data.cities.geonames.forEach(function (newCity) {
            addMarker(newCity);
        });
    });
}