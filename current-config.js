/*
 * hw.js - pdfHTML.js
 *
 * A homework toolkit for hackers
 * Copyright (C) 2015-2016 Alyssa Rosenzweig

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
 * pdfHTML.js inputs an HTML document,
 * and outputs a pdf version
 * this is used for printing markdown
 * this is dependent on phantomjs!
 */

var fs = require("fs");
var defaultConfig = require("./config.js");

function failMessage() {
    console.error("The configuration file could not be loaded.");
    console.error("Did you use `hw init` first?");
    console.error("If so, this is a bug. https://github.com/bobbybee/hw/issues/new");
    process.exit(1);
}


// import configuration file conditionally

function importConfig(command) {
    try {
        return require(process.cwd() + "/config.js");
    } catch(e) {
        // if this is init command, that's fine :)

        if(command != "init") {
            // alright, perhaps there is a default hw instance somewhere else,
            // and we can change dir there instead:

            console.log("Searching "+process.env["HOME"]+"/.hw_default");

            fs.readFile(process.env["HOME"]+"/.hw_default", function(err, data) {
                if(err) {
                    throw err;
                    failMessage();
                }

                var n = data.toString().trim();

                // alright, let's change directories and try again
                try {
                    process.chdir(n);
                } catch(e) {
                    console.error(e);
                    console.warn(process.cwd());
                    failMessage();
                }

                try {
                    return require(process.cwd() + "/config.js");
                } catch(e) {
                    // our options are exhausted at this point :(
                    failMessage();
                }
            });
        } else {
            return null;
        }
    }
}

/* merge the defaults with the user preferences as an override operation */

function combineConfig(defaults, user) {
    for(var preference in user) {
        defaults[preference] = user[preference];
    }

    return defaults;
}

module.exports = function(command) {
    return combineConfig(defaultConfig, importConfig(command));
}
