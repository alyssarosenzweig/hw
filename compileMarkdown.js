/*
 * hw.js
 * compileMarkdown.js
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
 * compileMarkdown.js compiles markdown to HTML using marked,
 * and embeds it into a configurable template.
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

