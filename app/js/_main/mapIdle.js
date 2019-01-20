function getCitiesInBounds(existingCitiesInIDB) {
    let cities = [];
    existingCitiesInIDB.forEach(function (city) {
        if (city.lat < bounds.north && city.lat > bounds.south && city.lng < bounds.east && city.lng > bounds.west) {
            cities.push(city);
        }
    });
    return cities;
}

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
    let citiesToMap = [];
    
    if (configuration.languageInput == "auto") {
        await autoLanguage();
    }
    
    let existingCitiesInIDB = await getCitiesIDB(bounds);
    let citiesInIDBBounds = getCitiesInBounds(existingCitiesInIDB);
    let citiesInIDBBoundsLanguage = getCitiesLanguage(citiesInIDBBounds);
    
    if (citiesInIDBBoundsLanguage.length >= 3) {
        //CITIES PRESENT IN BOUNDS WITH LANGUAGE IN IDB 
        citiesToMap = citiesInIDBBoundsLanguage.slice(0, 3);
    } else {
        //NO CITIES WITH IN BOUNDS WITH LANGUAGE IN IDB
        citiesToMap = await getCitiesInBoundsGeonames();
        citiesToMap.forEach(function (newCity) {
            let citytoAdd = createIDBObject(newCity);
            db.cities.add(citytoAdd);
        });
    }

    deleteMarkers();

    citiesToMap.forEach(function (city) {
        addMarker(city);
    });
}