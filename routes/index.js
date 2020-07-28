/* Router MAIN FILE */
const path = require("path");
const fs = require("fs");
const food_img_location = "./food_images/";
const step_img_location = "../CS496_Project3_Server/recipe_images/";
var multer = require("multer");
var temp_food;

const upload_img = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, food_img_location);
    },
    filename: function (req, file, cb) {
      temp_food = new Date().valueOf() + path.extname(file.originalname);
      cb(null, temp_food);
    },
  }),
});

module.exports = function (
  app,
  Recipe_Text,
  Recipe_Img,
  Recipe_Timer,
  Ingredients,
  Img,
  Food_Info,
  User
) {
  app.get("/main/get_recipes", function (request, response) {
    console.log("/main/get_recipes");

    /* It will contain all the recipes as a string */
    var recipe_names = "";
    var names_list;
    Img.find(function (err, recipes) {
      if (err) {
        return res.status(500).send({ error: "database failure" });
      }
      recipes.forEach(
        recipe => (recipe_names = recipe_names + recipe.name + "@")
      );
      names_list = recipe_names.split("@");
      names_list.pop();
      response.json(names_list);
    });
  });

  /**Show the ingridents for the given recipe_name
   * response will be Array of String */
  app.get("/main/ingredients/:recipe_name", function (request, response) {
    console.log("/main/ingredients/:recipe_name");
    var recipe_name = request.params.recipe_name;

    Ingredients.findOne({ name: recipe_name }, function (err, ingredients) {
      if (err) {
        return response.status(500).send({ error: "database failure" });
      }
      if (!ingredients) {
        return response.status(404).json({ error: "user not found" });
      }
      response.json(ingredients.ingredients.split("@"));
    });
    return;
  });

  /**Show the food image for the given recipe_name
   * response will be the img itself not img_path */
  app.get("/main/image/:recipe_name", function (request, response) {
    console.log("/main/image/:recipe_name");

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
          fs.access(file_path, fs.constants.F_OK, err => {
            if (err) {
              console.error(err);
              return response
                .status(404)
                .json({ msg: "Not Found", error: true });
            } else {
              return response.status(200).sendFile(file_path);
            }
          });
        } catch (error) {
          console.error(error);
          return response
            .status(500)
            .json({ msg: "Internal Error", error: true });
        }
      }
    });
  });

  /**Show main recipe_text for the given recipe_name
   * response will be the Array of String  */
  app.get("/main/recipe_text/:recipe_name", function (request, response) {
    console.log("/main/recipe_text/:recipe_name");
    var recipe_name = request.params.recipe_name;

    Recipe_Text.findOne({ name: recipe_name }, function (err, recipe_text) {
      if (err) {
        return response.status(500).send({ error: "database failure" });
      }
      if (!recipe_text) {
        return response.status(404).json({ error: "user not found" });
      }
      response.json(recipe_text.text_steps.split("@"));
    });
    return;
  });

  /**Show main recipe_img for the given recipe_name
   * response will be the Array of String file_name  */
  app.get("/main/recipe_img/:recipe_name", function (request, response) {
    console.log("/main/recipe_img/:recipe_name");
    var recipe_name = request.params.recipe_name;
    Recipe_Img.findOne({ name: recipe_name }, function (err, recipe_img) {
      if (err) {
        console.log(recipe_name);
        return response.status(500).send({ error: "database failure" });
      }
      if (!recipe_img) {
        return response.status(404).json({ error: "user not found" });
      }
      response.json(recipe_img.img_steps.split("@"));
    });
    return;
  });

  /**Show main recipe_timer for the given recipe_name
   * response will be the Array of String  */
  app.get("/main/recipe_timer/:recipe_name", function (request, response) {
    console.log("/main/recipe_timer/:recipe_name");
    var recipe_name = request.params.recipe_name;

    Recipe_Timer.findOne({ name: recipe_name }, function (err, recipe_timer) {
      if (err) {
        return response.status(500).send({ error: "database failure" });
      }
      if (!recipe_timer) {
        return response.status(404).json({ error: "user not found" });
      }
      response.json(recipe_timer.timer_steps.split("@"));
    });
    return;
  });

  /**Show the image from the given url */
  app.get("/main/step_img/:file_name", function (request, response) {
    console.log("/main/step_img/:file_name");

    var file_name = request.params.file_name;
    console.log(file_name);

    const dir_path = path.join(__dirname, "../recipe_images/");
    const file_path = path.join(dir_path, file_name);
    console.log(file_path);
    try {
      fs.access(file_path, fs.constants.F_OK, err => {
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
  });

  /* Save the ingredients to the dababase*/
  app.post("/main/ingredients", function (request, response) {
    console.log("/main/recipe/ingredients");
    console.log(request.body.name);
    console.log(request.body.ingredients);
    Ingredients.countDocuments({ name: request.body.name }, function (
      err,
      cnt
    ) {
      if (cnt) {
        response.json(
          "ingredients data for the " + request.body.name + " already exist"
        );
        console.log(
          "ingredients data for the " + request.body.name + " already exist"
        );
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

  app.post("/main/image", upload_img.single("file"), function (
    request,
    response
  ) {
    console.log("/main/image");
    console.log(request.file);
    console.log(request.body.name);
    Img.countDocuments({ name: request.body.name }, function (err, cnt) {
      if (cnt) {
        response.json("img for the " + request.body.name + " already exists");
        console.log("img for the " + request.body.name + " already exists");
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

  app.post("/main/recipe_text", function (request, response) {
    console.log(request.body.name);
    console.log(request.body.recipe_text);
    Recipe_Text.countDocuments({ name: request.body.name }, function (
      err,
      cnt
    ) {
      if (cnt) {
        response.json("Recipe for the " + request.body.name + " already exist");
        console.log("Recipe for the " + request.body.name + " already exist");
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

  app.post("/main/recipe_timer", function (request, response) {
    console.log(request.body.name);
    console.log(request.body.recipe_timer);
    Recipe_Timer.countDocuments({ name: request.body.name }, function (
      err,
      cnt
    ) {
      if (cnt) {
        response.json("Recipe for the " + request.body.name + " already exist");
        console.log("Recipe for the " + request.body.name + " already exist");
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

  /**Show the food_info for the given recipe_name
   * response will be Array of String */
  app.get("/main/food_info/:recipe_name", function (request, response) {
    console.log("/main/food_info/:recipe_name");
    var recipe_name = request.params.recipe_name;

    Food_Info.findOne({ name: recipe_name }, function (err, food_info) {
      if (err) {
        return response.status(500).send({ error: "database failure" });
      }
      if (!food_info) {
        return response.status(404).json({ error: "user not found" });
      }
      response.json(food_info.food_info.split("@"));
    });
    return;
  });

  /* Save the food_info to the dababase*/
  app.post("/main/food_info", function (request, response) {
    console.log("/main/food_info");
    console.log(request.body.name);
    console.log(request.body.food_info);
    Food_Info.countDocuments({ name: request.body.name }, function (err, cnt) {
      if (cnt) {
        response.json(
          "food_info data for the " + request.body.name + " already exist"
        );
        console.log(
          "food_info data for the " + request.body.name + " already exist"
        );
        return;
      } else {
        /* Get request's string */
        var food_info = new Food_Info();
        var post_data = request.body;
        food_info.name = post_data.name;
        food_info.food_info = post_data.food_info;

        food_info.save(function (err) {
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

  /* user apis */

  /* Registration for the first user */
  app.post('/user/register', function (request, response) {
    console.log('/user/register');
    /** Check the input is valid or not
     * Invalid if there is same value in the database already */
    User.countDocuments({ id: request.body.id }, function (err, cnt) {
      if (cnt) {
        response.json('ID already exists');
        console.log('ID already exists');
      } else {
        /* Get request's string */
        var user = new User();
        var post_data = request.body;
        user.id = post_data.id;
        user.password = post_data.password;
        user.first_name = post_data.first_name;
        user.last_name = post_data.last_name;
        user.email = post_data.email;
        user.food_list = ' ';

        user.save(function (err) {
          if (err) {
            console.err(err);
            response.json("0");
            return;
          }
          response.json("1");
        });
      }
    });
    return;
  });

  /* Check the new ID is valid or not*/
  app.get('/user/register/:newID', function (request, response) {
    console.log('/user/register/:newID');
    console.log(request.params.newID);
    User.countDocuments({ id: request.params.newID }, function (err, cnt) {
      if (!cnt) {
        /* newID valid */
        return response.json("1");
      }
      /* newID is already exists */
      return response.json("0");
    });
    return;
  });

  /* login for the application use */
  app.post('/user/login', function (request, response) {
    console.log('/user/login');

    /** Check the input is valid or not
     * Invalid if there is no corresponding document values
     * in the database already */
    User.countDocuments({ id: request.body.id }, function (err, cnt) {
      if (!cnt) {
        response.json('ID not exists');
        console.log('ID not exists');
        return;
      } else {
        /* Get request's string */
        var post_data = request.body;
        var id = post_data.id;
        var password = post_data.password;
        User.findOne({ id: id }, function (err, user) {
          /* unknown error */
          if (err) {
            response.end();
          } else if (password == user.password) {
            response.json('1');
            console.log('Login success');
          } else {
            response.json('0');
            console.log('Wrong password');
          }
        });
      }
    });
    return;
  });

  /* update the user food list  */
  app.post('/user/like_food', function (request, response) {
    console.log('/user/like_food');
    var recipe_name = request.body.recipe_name;
    var id = request.body.id;

    User.findOne({ id: id }, function (err, user) {
      if (err) {
        return response.status(500).send({ error: "database failure" });
      }
      if (!user) {
        return response.status(404).json({ error: "user not found" });
      }
      if (user.food_list.includes("recipe_name")) {
        return response.json(recipe_name + ' is already in the list')
      } else {
        user.food_list = user.food_list + '@' + recipe_name;
        user.save(function (err) {
          if (err)
            response.status(500).json({ error: "failed to update" });
          response.json("1");
        });
      };
    });
  });

  app.get('/user/get_like_food/:user_id', function (request, response) {
    console.log('/user/get_like_food/:user_id');
    var id = request.params.user_id;
    User.findOne({ id: id }, function (err, user) {
      if (err) {
        return response.status(500).send({ error: "database failure" });
      }
      if (!user) {
        return response.status(404).json({ error: "user not found" });
      }
      var food_list = user.food_list.split('@');
      food_list.shift()
      response.json(food_list)


    });

  });











};
