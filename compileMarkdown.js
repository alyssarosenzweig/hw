/*
 * compileMarkdown.js
 * part of `hw` by Alyssa Rosenzweig,
 * under the GPLv2 license.
 * compiles markdown to HTML using marked,
 * and embeds it in a template
 */

var fs = require("fs");
var marked = require("marked");

module.exports = function(file, callback, carg) {
    fs.readFile(file, function(err, data) {
        if(err) throw err;

        data = marked(data.toString());

        fs.readFile("template.html", function(err, template) {
            if(err) throw err;
            
            var html = template.toString()
                      .replace("%%%CONTENTHERE%%%", data);
            
            callback(html, carg);
        });

    });
}

