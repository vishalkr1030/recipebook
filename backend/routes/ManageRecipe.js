const router = require("express").Router();
const pool = require("../dbconfig");

router.post("/add", async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      selectedIngredients,
      instructions,
      preparationTime,
      cookingTime,
      servings,
      difficultyLevel,
      cuisineType,
      mealType,
      courseType,
      status,
      userId,
    } = req.body;
    const newRecipe = await pool.query(
      `INSERT INTO recipe 
        (name, description, image, ingredients, instructions, preparation_time, cooking_time, total_time, servings, difficulty, cuisine, meal_type, status, course_type, user_id) VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
        RETURNING *`,
      [
        name,
        description,
        imageUrl,
        selectedIngredients,
        instructions,
        preparationTime,
        cookingTime,
        parseInt(preparationTime) + parseInt(cookingTime),
        servings,
        difficultyLevel,
        cuisineType,
        mealType,
        status,
        courseType,
        userId,
      ]
    );
    res.json(newRecipe.rows[0]);
    if (
      !AddNotification(
        newRecipe.rows[0].id,
        newRecipe.rows[0].user_id,
        newRecipe.rows[0].name
      )
    ) {
    }
  } catch (err) {
    console.error(err.message);
  }
});
async function AddNotification(recipe_id, user_id, Recipename) {
  try {
    const name = await pool.query("select * from user_data where id=$1", [
      user_id,
    ]);
    const requires = await pool.query(
      "select * from user_data where role='admin'"
    );
    const reason =
      name.rows[0].first_name +
      " " +
      "request for accept the recipe name " +
      Recipename;
    await pool.query(
      "INSERT INTO notifications(user_id, recipe_id, reason) VALUES ($1, $2, $3)",
      [requires.rows[0].id, recipe_id, reason]
    );
    return true;
  } catch (err) {
    console.error(err);
  }
}

router.put("/update", async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      selectedIngredients,
      instructions,
      preparationTime,
      cookingTime,
      servings,
      difficultyLevel,
      cuisineType,
      mealType,
      courseType,
      id,
    } = req.body;
    const updatedRecipe = await pool.query(
      `UPDATE recipe
      SET
          name = $1,
          description = $2,
          image = $3,
          ingredients = $4,
          instructions = $5,
          preparation_time = $6,
          cooking_time = $7,
          total_time = $8,
          servings = $9,
          difficulty = $10,
          cuisine = $11,
          meal_type = $12,
          course_type = $13
      WHERE
          id = $14
      RETURNING *;
      `,
      [
        name,
        description,
        imageUrl,
        selectedIngredients,
        instructions,
        preparationTime,
        cookingTime,
        parseInt(preparationTime) + parseInt(cookingTime),
        servings,
        difficultyLevel,
        cuisineType,
        mealType,
        courseType,
        id,
      ]
    );

    res.json(updatedRecipe.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRecipe = await pool.query("DELETE FROM recipe WHERE id = $1", [
      id,
    ]);
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error(err.message);
  }
});

router.put("/status", async (req, res) => {
  try {
    const { recipeStatus, recipeId } = req.body;
    const updatedStatus = await pool.query(
      `UPDATE recipe SET status = $1 WHERE id = $2 RETURNING *; `,
      [recipeStatus, recipeId]
    );
    res.json(updatedStatus.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

router.put("/status", async (req, res) => {
  try {
    const { recipeStatus, recipeId } = req.body;
    const updatedStatus = await pool.query(
      `UPDATE recipe SET status = $1 WHERE id = $2 RETURNING *; `,
      [recipeStatus, recipeId]
    );
    res.json(updatedStatus.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/myrecipes/:id", async (req, res) => {
  let searchText = req.query.searchText;
  let filter = {
    mealType: req.query.mealType,
    course: req.query.course,
    cuisine: req.query.cuisine,
    rating: req.query.rating,
  };
  const arrayReduce = (arr) => {
    let out = "";
    arr.map((item) => (out += `,'${item}'`));
    return out.substring(1);
  };
  const filterQryConstruct = (filter, value) =>
    ` and ${filter} IN (${value ? arrayReduce(value) : ""})`;
  let qry = `select r.id, r.image, r.total_time, r.name, r.cuisine, u.first_name, r.status
    from recipe r JOIN user_data u ON u.id = r.user_id
    where u.id = '${req.params.id}'
      and r.name ilike '%${searchText}%' 
      ${filter.rating ? `and r.rating >= ${filter.rating[0]}` : ""} 
      ${
        filter.mealType
          ? Array.isArray(filter.mealType)
            ? filterQryConstruct("r.meal_type", filter.mealType)
            : `and r.meal_type = '${filter.mealType}'`
          : ""
      } 
      ${
        filter.course
          ? Array.isArray(filter.course)
            ? filterQryConstruct("r.course_type", filter.course)
            : `and r.course_type = '${filter.course}'`
          : ""
      } 
      ${
        filter.cuisine
          ? Array.isArray(filter.cuisine)
            ? filterQryConstruct("r.cuisine", filter.cuisine)
            : `and r.cuisine = '${filter.cuisine}'`
          : ""
      };
      `;
  try {
    const allMyRecipes = await pool.query(qry);
    res.json(allMyRecipes.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
