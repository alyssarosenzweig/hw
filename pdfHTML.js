/* pdfHTML.js
 * part of `hw` by Alyssa Rosenzweig,
 * under the GPLv2 license.
 * inputs an HTML document,
 * and outputs a pdf version 
 * this is used for printing markdown
 * this is dependent on phantomjs!
 */

module.exports = function(html, output) {
    var pdf = require("html-pdf");

    pdf.create(html, {
        format: 'Letter',
        phantomPath: "/usr/bin/phantomjs",
        border: "1in"
    }).toFile(output, function(err, res) {
        if(err) throw err;
    });
}
