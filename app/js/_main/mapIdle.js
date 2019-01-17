async function mapIdle() {
    let citiesToMap = [];
    
    if (configuration.languageInput == "auto") {
        await autoLanguage();
    }
    
    let existingCitiesInIDB = await getCitiesInBoundsinIDB(bounds);
    
    
    existingCitiesInIDB.forEach(function (city) {
        if (city.lat < bounds.north && city.lat > bounds.south && city.lng < bounds.east && city.lng > bounds.west) {
            if (city.language == configuration.language) {
                citiesToMap.push(city);
            }
        }
    });
    
    async function asyncCreation(newCities) {
        for await (const city of newCities) {
            let citytoAdd = createIDBObject(city);
            
            if (!_.findWhere(citiesToMap, {"geonameID": citytoAdd.geonamesID})) {
                db.cities.put(citytoAdd);
                citiesToMap.push(citytoAdd);
            }
        }
    }
    
    if (citiesToMap.length < 3) {
        let newCities = await getCitiesInBoundsGeonames(3 - citiesToMap.length);
        await asyncCreation(newCities);
    } else {
        citiesToMap = reduceSortCities(citiesToMap);
    }

    citiesToMap.forEach(function (city) {
        addMarkerandInfoWindow(citiesToMap, city);
    });
}

function reduceSortCities(citiesToMap) {
    citiesToMap = _.sortBy(citiesToMap, 'population').reverse();
    citiesToMap = citiesToMap.slice(0, 3);
    return citiesToMap;
}
