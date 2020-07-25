/* Router MAIN FILE */
const path = require('path');
const fs = require('fs');
var multer = require('multer');
const food_img_location = '../CS496_Project3_Server/food_images/';
const step_img_location = '../CS496_Project3_Server/recipe_images/';


module.exports = function (app, Recipe, Ingredients, Img) {

    /**Show the ingridents for the given recipe_name
     * response will be Array of String */
    app.get('/main/ingredients/:recipe_name', function (request, response) {
        console.log('/main/ingredients/:recipe_name');
        var recipe_name = request.params.recipe_name;

        Ingredients.findOne({ name: recipe_name }, function (err, ingredients) {
            if (err) {
                return response.status(500).send({ error: 'database failure' });
            }
            if (!ingredients) {
                return response.status(404).json({ error: 'user not found' });
            }
            response.json(ingredients.ingredients);
        });
        return;
    });

    /**Show the food image for the given recipe_name
     * response will be Array of json object {text, img_path, time} */
    app.get('/main/image/:recipe_name', function (request, response) {
        console.log('/main/image/:recipe_name')
        var recipe_name = request.params.recipe_name;
        response.end("nothing yet");
    });

    /**Show main recipe for the given recipe_name
     * response will be the img itself not img_path */
    app.get('/main/recipe/:recipe_name', function (request, response) {
        console.log('/main/recipe/:recipe_name');
        var recipe_name = request.params.recipe_name;
        response.end("nothing yet");
    });

    /* Save the ingredients to the dababase*/
    app.post('/main/ingredients', function (request, response) {
        console.log('/main/recipe/ingredients');
        console.log(request.body.name);
        console.log(request.body.ingredients);
        Ingredients.countDocuments({ name: request.body.name }, function (err, cnt) {
            if (cnt) {
                response.json('ingredients data for the ' + request.body.name + ' are already exists');
                console.log('ingredients data for the ' + request.body.name + ' are already exists');
                return;
            } else {
                /* Get request's string */
                var ingredients = new Ingredients();
                var post_data = request.body;
                ingredients.name = post_data.name;
                ingredients.ingredients = post_data.ingredients;

                ingredients.save(function (err) {
                    if (err) {
                        console.err(err);
                        response.json("0");
                        return;
                    }
                    response.json("1");
                });
            }
        });
    });
}