function forageLocalStorage() {
    if (localStorage.getItem('configuration')) {
        configuration = JSON.parse(localStorage.getItem('configuration'));
    } else {
        axios.get("configuration.json").then(function (data) {
            localStorage.setItem('configuration', JSON.stringify(data.data));
            configuration = data.data;
        });
    }
}

function setLocalStorage(configuration) {
    localStorage.setItem('configuration', JSON.stringify(configuration));
}
