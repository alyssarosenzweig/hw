/*
 * hw.js - printHTML.js
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
 * alyssa@rosenzweig.io
 *
 * inputs an HTML document,
 * and opens it in a web browser for printing / rendering.
 * this is used for printing markdown
 * 
 */


var http = require("http");
var config = require(__dirname + "/config.js");
var exec = require("child_process").exec;

module.exports = function(html) {
    // open a temporary web server
    http.createServer(function(req, res) {
        res.writeHead(200, {"Content-Type":"text/html"});
        res.end(html);

        process.exit(0);
    }).listen(8080);

    // open in the users web browser
    exec(config.browser+ " http://localhost:8080");
}
