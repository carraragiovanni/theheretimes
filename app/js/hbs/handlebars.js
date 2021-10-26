function renderTemplate(templateName, data, container) {
    if (!data) {
        data = {}
    }
    container.html("");
    let t = JST[templateName];
    let h = t(data);
    container.html(h);
}

Handlebars.registerHelper('extractDomain', function (url) {
    return url.split("/")[2];
});

Handlebars.registerHelper('parsePublishedAtDate', function (publishedAt) {
    if (publishedAt != null) {
        return moment(publishedAt).format("L");
    }
});