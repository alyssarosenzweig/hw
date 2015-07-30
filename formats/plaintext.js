/*
 * hw.js - formats/plaintext.js
 *
 * A homework toolkit for hackers 
 * Copyright (C) 2015 Alyssa Rosenzweig

 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
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

var printHTML = require("../printHTML.js");
var pdfHTML = require("../pdfHTML.js");
var chopExtension = require("../chopExtension.js");

var config = require(process.cwd() + "/config.js");

module.exports.extension = "txt";

module.exports.defaultText = function(name, cls) {
    return [config.name, config.getDate(), cls, name].join("\n");
}

function compilePlaintext(file, callback, carg) {
    fs.readFile(file, function(err, data) {
        if(err) throw err;

        // escape everything
        var html = data.split("\n").map(encodeURIComponent).join("<br/>");

        fs.readFile("template.html", function(err, template) {
            if(err) throw err;

            callback(template.toString().replace("%%%CONTENTHERE%%%",  html));
        });
    });
}
module.exports.print = function(file, pdf) {
    compilePlaintext(
        file,
        pdf ? pdfHTML : printHTML,
        pdf ? chopExtension(file) + ".pdf" : ""
    );
}
