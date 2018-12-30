this["JST"] = this["JST"] || {};

this["JST"]["bottomSide"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "    <div class=\"article row\">\n        <div class=\"col s2 valign-wrapper\">\n            <img class=\"website-icon\" src=\"//logo.clearbit.com/"
    + alias3((helpers.extractDomain || (depth0 && depth0.extractDomain) || alias2).call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"extractDomain","hash":{},"data":data}))
    + "\">\n        </div>\n        <div class=\"col s10\">\n            <a href=\""
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n            <p>"
    + alias3((helpers.parsePublishetAtDate || (depth0 && depth0.parsePublishetAtDate) || alias2).call(alias1,(depth0 != null ? depth0.publishedAt : depth0),{"name":"parsePublishetAtDate","hash":{},"data":data}))
    + "</p>\n        </div>\n    </div>\n    <div class=\"divider\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"articlesBottom\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.articles : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["bottomSideTitle"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row\">\n    <div class=\"col s10\" id=\"city-name\">\n        <h4>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</h4>\n    </div>\n    <div class=\"col s2 valign-wrapper\">\n        <a onclick=\"closeRightBottom()\">\n            <i id=\"close-icon-bottomSide\" class=\"material-icons\">close</i>\n        </a>\n    </div>\n</div>\n<div id=\"bottomSideArticlesContainer\">\n</div>";
},"useData":true});

this["JST"]["customInfoWindow"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div>\n    <h4>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</h4>\n</div>";
},"useData":true});

this["JST"]["rightSide"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "    <div class=\"article row\">\n        <div class=\"col s2 valign-wrapper\">\n            <img class=\"website-icon\" src=\"//logo.clearbit.com/"
    + alias3((helpers.extractDomain || (depth0 && depth0.extractDomain) || alias2).call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"extractDomain","hash":{},"data":data}))
    + "\">\n        </div>\n        <div class=\"col s10\">\n            <a href=\""
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n            <p>"
    + alias3((helpers.parsePublishetAtDate || (depth0 && depth0.parsePublishetAtDate) || alias2).call(alias1,(depth0 != null ? depth0.publishedAt : depth0),{"name":"parsePublishetAtDate","hash":{},"data":data}))
    + "</p>\n        </div>\n    </div>\n    <div class=\"divider\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"articlesRight\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.articles : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["rightSideTitle"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row\">\n    <div class=\"col s10\" id=\"city-name\">\n        <h4>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</h4>\n    </div>\n    <div class=\"col s2 valign-wrapper\">\n        <a onclick=\"closeRightBottom()\">\n            <i id=\"close-icon-rightSide\" class=\"material-icons\">close</i>\n        </a>\n    </div>\n</div>\n<div id=\"rightSideArticlesContainer\">\n</div>";
},"useData":true});