

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