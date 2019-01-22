this["JST"] = this["JST"] || {};

this["JST"]["bottomSide"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"article row\">\n            <a href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n            <p>"
    + alias4((helpers.parsePublishedAtDate || (depth0 && depth0.parsePublishedAtDate) || alias2).call(alias1,(depth0 != null ? depth0.publishedAt : depth0),{"name":"parsePublishedAtDate","hash":{},"data":data}))
    + "</p>\n    </div>\n    <div class=\"divider\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"articlesRight\">\n"
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

this["JST"]["logIn"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"log-in-window\">\n    <i id=\"close-icon-sign-up-login\" class=\"material-icons\" onclick=\"closeSignInWindow()\">close</i>\n    <div>\n        <input type=\"text\" id=\"email\" name=\"email\" placeholder=\"Email\" />\n        <input type=\"password\" id=\"password\" name=\"password\" placeholder=\"Password\" />\n    </div>\n    <div class=\"flexbox-center\">\n        <button id=\"#log-in\">Log In</button>\n        <button id=\"#forgot-password\">Forgot Password</button>\n    </div>\n</div>";
},"useData":true});

this["JST"]["rightSide"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"article row\">\n        <div class=\"col s10\">\n            <a href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n            <p>"
    + alias4((helpers.parsePublishedAtDate || (depth0 && depth0.parsePublishedAtDate) || alias2).call(alias1,(depth0 != null ? depth0.publishedAt : depth0),{"name":"parsePublishedAtDate","hash":{},"data":data}))
    + "</p>\n        </div>\n    </div>\n    <div class=\"divider\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"articlesRight\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.articles : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["rightSideTitle"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row\">\n    <div class=\"flexbox right-side-title\">\n        <div id=\"city-name\">\n            <h4>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</h4>\n        </div>\n        <a class=\"close-icon\" onclick=\"closeRightBottom()\">x</a>\n    </div>\n</div>\n\n<div id=\"rightSideArticlesContainer\">\n</div>";
},"useData":true});

this["JST"]["signInUpMain"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"log-in-sign-up-window\">\n    <i id=\"close-icon-sign-up-login\" class=\"material-icons\" onclick=\"closeSignInWindow()\">close</i>\n    <div id=\"sign-up-log-in-buttons\">\n            <button id=\"log-in-selector\">Log In</button>\n            <button id=\"sign-up-selector\">Sign Up</button>\n    </div>\n</div>";
},"useData":true});

this["JST"]["signUp"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"sign-up-window\">\n    <i id=\"close-icon-sign-up-login\" class=\"material-icons\" onclick=\"closeSignInWindow()\">close</i>\n    <div>\n        <input type=\"text\" id=\"email\" name=\"email\" placeholder=\"Email\" />\n        <input type=\"password\" id=\"password\" name=\"password\" placeholder=\"Password\" />\n    </div>\n    <div class=\"flexbox-center\">\n        <button id=\"sign-up\">Sign Up</button>\n    </div>\n</div>";
},"useData":true});