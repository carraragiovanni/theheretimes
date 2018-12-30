async function writeConfigurationFile() {
    return await axios.get("configuration.json").then(function (data) {
        localStorage.setItem('configuration', JSON.stringify(data.data));
        configuration = data.data;
    });
}

function getLocalStorage() {
    configuration = JSON.parse(localStorage.getItem('configuration'));
}

async function setLocalStorage(configuration) {
    return await localStorage.setItem('configuration', JSON.stringify(configuration));
}
