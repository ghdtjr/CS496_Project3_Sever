/* Router MAIN FILE */
const path = require('path');

module.exports = function (app) {

    /* Show main recipe for the given recipe name from main page */
    app.get('/main/:recipe_name', function (request, response) {
        console.log('/main/:recipe_name');
        response.end("nothing yet");
    });
}