/* printHTML.js
 * part of `hw` by Alyssa Rosenzweig,
 * under the GPLv2 license.
 * inputs an HTML document,
 * and opens it in a web browser for printing / rendering.
 * this is used for printing markdown
 */

var http = require("http");

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
