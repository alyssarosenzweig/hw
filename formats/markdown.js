/*
 * hw.js - formats/markdown.js
 *
 * A homework toolkit for hackers 
 * Copyright (C) 2015 Alyssa Rosenzweig

 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Electronic Mail Address:
 * alyssa.a.rosenzweig@gmail.com
 *
 */

var fs = require("fs");
var marked = require("marked");

var printHTML = require("../printHTML.js");
var pdfHTML = require("../pdfHTML.js");
var chopExtension = require("../chopExtension.js");

var config = require(process.cwd() + "/config.js");

// the extension of every markdown file should be .md
// declare that here

module.exports.extension = "md";

// when a new markdown document is created, a special header is added by default
// that header is created here from the document name and class name,
// and returned to be injected into the new document

module.exports.defaultText = function(name, cls) {
    // table header

    var slots = [config.name,
               config.getDate(),
               cls,
               name];

    // class name some times may be omitted
    if(!slots[2]) slots.splice(2, 1);

    var maxLen = [0].concat(slots).reduce(function(a, b) {
      return Math.max(a, b.length);
    }) + 2;

    defaultText =  "|" + (Array(maxLen).join(" ")) + "|" + "\n"
                + "-" + (Array(maxLen).join("-")) + "|" + "\n";

    slots.forEach(function(slot) {
      defaultText += " " + slot + (Array(maxLen - slot.length).join(" ")) + "|" + "\n";
    });

    return defaultText;
};

// compileMarkdown is an internally used function for compiling markdown to HTML
// this is essential for rendering the document

function compileMarkdown(file, callback, carg) {
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

// prints the markdown document:
// the idea is to compile markdown to HTML,
// and then send the HTML to the hw module for printing or rasterizing HTML,
// depending on whether a paper print or a PDF is requested

module.exports.print = function(file, pdf) {
    compileMarkdown(
        file,
        pdf ? pdfHTML : printHTML,
        pdf ? chopExtension(file) + ".pdf" : ""
    );
}
