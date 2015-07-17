/* pdfHTML.js
 * part of `hw` by Alyssa Rosenzweig,
 * under the GPLv2 license.
 * inputs an HTML document,
 * and outputs a pdf version 
 * this is used for printing markdown
 * this is dependent on phantomjs!
 */

var pdf = require("html-pdf");

module.exports = function(html, output) {
    pdf.create(html, {
        format: 'Letter'
    }).toFile(output, function(err, res) {
        if(err) throw err;
    });
}
