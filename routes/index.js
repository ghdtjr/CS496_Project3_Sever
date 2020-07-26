/* Router MAIN FILE */
const path = require('path');
const fs = require('fs');
const food_img_location = './food_images/';
const step_img_location = '../CS496_Project3_Server/recipe_images/';
var multer = require('multer');
var temp_food;

const upload_img = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, food_img_location);
        },
        filename: function (req, file, cb) {
            temp_food = new Date().valueOf() + path.extname(file.originalname);
            cb(null, temp_food);
        }
    }),
});


module.exports = function (app, Recipe_Text, Recipe_Img, Recipe_Timer, Ingredients, Img) {

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
            response.json(ingredients.ingredients.split("@"));
        });
        return;
    });

    /**Show the food image for the given recipe_name
     * response will be the img itself not img_path */
    app.get('/main/image/:recipe_name', function (request, response) {
        console.log('/main/image/:recipe_name');

        var recipe_name = request.params.recipe_name;
        console.log(recipe_name);
        Img.findOne({ name: recipe_name }, function (err, img) {
            /* unknown error */
            if (err) {
                response.json("No image for this recipe");
                return;
            } else {
                console.log(img);
                const dir_path = path.join(__dirname, "../food_images/");
                const file_path = path.join(dir_path, img.file_name);
                console.log(file_path);
                try {
                    fs.access(file_path, fs.constants.F_OK, (err) => {
                        if (err) {
                            console.error(err);
                            return response.status(404).json({ msg: "Not Found", error: true });
                        } else {
                            return response.status(200).sendFile(file_path);
                        }
                    });

                } catch (error) {
                    console.error(error);
                    return response.status(500).json({ msg: "Internal Error", error: true });
                }
            }
        });
    });

    /**Show main recipe_text for the given recipe_name
     * response will be the Array of String  */
    app.get('/main/recipe_text/:recipe_name', function (request, response) {
        console.log('/main/recipe_text/:recipe_name');
        var recipe_name = request.params.recipe_name;

        Recipe_Text.findOne({ name: recipe_name }, function (err, recipe_text) {
            if (err) {
                return response.status(500).send({ error: 'database failure' });
            }
            if (!recipe_text) {
                return response.status(404).json({ error: 'user not found' });
            }
            response.json(recipe_text.text_steps.split("@"));
        });
        return;
    });

    /**Show main recipe_img for the given recipe_name
     * response will be the Array of String url  */
    app.get('/main/recipe_img/:recipe_name', function (request, response) {
        console.log('/main/recipe_img/:recipe_name');
        var recipe_name = request.params.recipe_name;

        Recipe_Img.findOne({ name: recipe_name }, function (err, recipe_img) {
            if (err) {
                return response.status(500).send({ error: 'database failure' });
            }
            if (!recipe_img) {
                return response.status(404).json({ error: 'user not found' });
            }
            response.json(recipe_img.img_steps.split("@"));
        });
        return;
    });

    /**Show main recipe_timer for the given recipe_name
     * response will be the Array of String  */
    app.get('/main/recipe_timer/:recipe_name', function (request, response) {
        console.log('/main/recipe_timer/:recipe_name');
        var recipe_name = request.params.recipe_name;

        Recipe_Timer.findOne({ name: recipe_name }, function (err, recipe_timer) {
            if (err) {
                return response.status(500).send({ error: 'database failure' });
            }
            if (!recipe_timer) {
                return response.status(404).json({ error: 'user not found' });
            }
            response.json(recipe_timer.timer_steps.split(","));
        });
        return;
    });











    /* Save the ingredients to the dababase*/
    app.post('/main/ingredients', function (request, response) {
        console.log('/main/recipe/ingredients');
        console.log(request.body.name);
        console.log(request.body.ingredients);
        Ingredients.countDocuments({ name: request.body.name }, function (err, cnt) {
            if (cnt) {
                response.json('ingredients data for the ' + request.body.name + ' already exist');
                console.log('ingredients data for the ' + request.body.name + ' already exist');
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

    app.post('/main/image', upload_img.single('file'), function (request, response) {
        console.log('/main/image');
        console.log(request.file);
        console.log(request.body.name);
        Img.countDocuments({ name: request.body.name }, function (err, cnt) {
            if (cnt) {
                response.json('img for the ' + request.body.name + ' already exists');
                console.log('img for the ' + request.body.name + ' already exists');
                return;
            } else {
                /* Get request's string */
                var img = new Img();
                var post_data = request.body;
                img.name = post_data.name;
                img.file_name = temp_food;
                img.save(function (err) {
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

    app.post('/main/recipe_text', function (request, response) {
        console.log(request.body.name);
        console.log(request.body.recipe_text);
        Recipe_Text.countDocuments({ name: request.body.name }, function (err, cnt) {
            if (cnt) {
                response.json('Recipe for the ' + request.body.name + ' already exist');
                console.log('Recipe for the ' + request.body.name + ' already exist');
                return;
            } else {
                /* Get request's string */
                var recipe_text = new Recipe_Text();
                var post_data = request.body;
                recipe_text.name = post_data.name;
                recipe_text.text_steps = post_data.recipe_text;

                recipe_text.save(function (err) {
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

    app.post('/main/recipe_timer', function (request, response) {
        console.log(request.body.name);
        console.log(request.body.recipe_timer);
        Recipe_Timer.countDocuments({ name: request.body.name }, function (err, cnt) {
            if (cnt) {
                response.json('Recipe for the ' + request.body.name + ' already exist');
                console.log('Recipe for the ' + request.body.name + ' already exist');
                return;
            } else {
                /* Get request's string */
                var recipe_timer = new Recipe_Timer();
                var post_data = request.body;
                recipe_timer.name = post_data.name;
                recipe_timer.timer_steps = post_data.recipe_timer;

                recipe_timer.save(function (err) {
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