/*
 * hw.js - formats/latex.js
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
 */

var exec = require("child_process").exec;
var config = require(process.cwd() + "/config.js");

var chopExtension = require("../chopExtension.js");

module.exports.extension = "tex";

function getLastName() {
    var parts = config.name.split(" ");
    return parts[parts.length - 1];
}

module.exports.defaultText = function(name, cls) {
    return "" +
        "\\documentclass[12pt]{article}\n" +
        "\\usepackage{hwmla}\n" +
        "\n" +
        "\\hwauthor{" + config.name + "}\n" +
        "\\hwdate{" + config.getDate() + "}\n" +
        "\\hwclass{" + cls + "}\n" +
        "\\hwproject{" + name + "}\n" +
        "\\hwlastname{" + getLastName() + "}\n" +
        "\\hwtitle{" + name + "}\n" +
        "\n" +
        "\\begin{document}\n" +
        "\\makeheader\n" +
        "\n" +
        "\\makeworkscited\n" +
        "\n" +
        "\\end{document}\n";
}

module.exports.print = function(file) {
    exec("latex " + file + " && dvipdf " + (chopExtension(file) + ".dvi"));
}
