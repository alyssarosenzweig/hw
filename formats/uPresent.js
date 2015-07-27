/*
 * hw.js - formats/uPresent.js
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
 * compileUPresent.js compiles uPresent to HTML using `up`
 */

var fs = require("fs");
var child_process = require("child_process");

var printHTML = require("../printHTML.js");
var pdfHTML = require("../pdfHTML.js");
var chopExtension = require("../chopExtension.js");

module.exports.extension = "up";

module.exports.defaultText = function(name, cls) {
    return name + "\n" +
           "\n" +
           "theme: Modern Dark\n" +
           "\n";
}

function compileUPresent(file, callback, carg) {
    fs.readFile(file, function(err, data) {
        if(err) throw err;

        child_process.exec("up -m "+file, function(err, stdout, stderr) {
            callback(stdout, carg);
        });
    });
}

module.exports.print = function(file, pdf) {
    // printing a uPresent file doesn't make a whole lot of sense,
    // but it might be useful at some point,
    // so it's supported, just for the sake of completeness
   
    compileUPresent(
        file,
        pdf ? pdfHTML : printHTML,
        pdf ? chopExtension(file) + ".pdf" : ""
    );
}
