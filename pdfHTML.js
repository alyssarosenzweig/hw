/* printHTML.js
 * part of `hw` by Alyssa Rosenzweig,
 * under the GPLv2 license.
 * inputs an HTML document,
 * and outputs a pdf version 
 * this is used for printing markdown
 * this is dependent on phantomjs!
 */

var childProcess = require("child_process");

try {
    var phantomjs = require("phantomjs");
} catch(e) {
    console.log("Warning: phantomjs not available");
}

module.exports = function(html) {
    childProcess.execFile(
            phantomjs.path,
            [__dirname + "/pdf.js"],
    function(err, stdout, stderr) {

    });
}

