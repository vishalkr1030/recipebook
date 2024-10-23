const router = require("express").Router();
const pool = require("../dbconfig");
const bcrypt = require("bcrypt");

router.get("/user-profile/:id", (req, res) => {
  const userId = req.params.id;
  pool.query(
    `select * from user_data where id= $1`,
    [userId],
    (error, result) => {
      if (error) {
        console.error("Error fetching user-data", error);
        res.status(500).json({ error: "Internal error" });
      } else {
        if (result.rows.length === 0) {
          res.status(404).json({ error: "User not found" });
        } else {
          const user = result.rows[0];
          res.json({
            id: user.id,
            name: user.first_name + " " + user.last_name,
            email: user.email,
            gender: user.gender,
            role: user.role,
            phone: user.phone_number,
            fname: user.first_name,
            lname: user.last_name,
            about: user.about,
            address: user.address,
          });
        }
      }
    }
  );
});

router.get("/User-role/:recipeId/:userId", (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.params.userId;
  pool.query(
    `select user_data.role as role from user_data join recipe on recipe.user_id = user_data.id where recipe.id = $1 and user_id = $2`,
    [recipeId, userId],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Internal Error" });
      } else {
        if (result.rows.length === 0) {
          res.json({ role: "user" });
        } else {
          res.json({ role: result.rows[0].role });
        }
      }
    }
  );
});

router.get("/favourites/:userId/:recipeId", async (req, res) => {
  const userId = req.params.userId;
  const recipeId = req.params.recipeId;
  pool.query(
    `select * from favorites where user_id = $1 and recipe_id = $2`,
    [userId, recipeId],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Internal error" });
      } else {
        if (result.rows.length === 0) {
          res.json({ fav: false });
        } else {
          res.json({ fav: true });
        }
      }
    }
  );
});

router.get("/favCount/:id", (req, res) => {
  const userId = req.params.id;
  pool.query(
    `select count(*) as count from favorites where user_id = $1`,
    [userId],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Error Fetching Count" });
      } else {
        if (result.rows.length === 0) {
          res.json({ count: 0 });
        } else {
          const counter = result.rows[0];
          res.json({ count: counter.count });
        }
      }
    }
  );
});

router.get("/likedCuisine/:id", (req, res) => {
  const userId = req.params.id;
  pool.query(
    `SELECT r.Cuisine AS Favorite_Cuisine, COUNT(*) AS Total_Count
    FROM Favorites f
    JOIN Recipe r ON f.Recipe_id = r.id
    WHERE f.User_ID = $1
    GROUP BY r.Cuisine
    ORDER BY Total_Count DESC
    LIMIT 1`,
    [userId],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Error Fetching Cuisine" });
      } else {
        if (result.rows.length === 0) {
          res.json({ cuisine: "Nothing to show here" });
        } else {
          const counter = result.rows[0];
          res.json({ cuisine: counter.favorite_cuisine });
        }
      }
    }
  );
});

router.get("/favCourse/:id", (req, res) => {
  const userId = req.params.id;
  pool.query(
    `SELECT r.Course_type AS Favorite_Course, COUNT(*) AS Total_Count
      FROM Favorites f
      JOIN Recipe r ON f.Recipe_id = r.id
      WHERE f.User_ID = $1
      GROUP BY r.Course_type
      ORDER BY Total_Count DESC
      LIMIT 1`,
    [userId],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Error Fetching Course" });
      } else {
        if (result.rows.length === 0) {
          res.json({ course: "Nothing to show here" });
        } else {
          const counter = result.rows[0];
          res.json({ course: counter.favorite_course });
        }
      }
    }
  );
});

router.get(`/Password/:oldPass/:userId`, async (req, res) => {
  const pass = req.params.oldPass;
  const userId = req.params.userId;
  pool.query(
    `select * from user_data where id = $1`,
    [userId],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: " Error verifying password" });
      } else {
        const passwordStatus = bcrypt.compare(pass, result.rows[0].password);
        if (!passwordStatus) {
          res.status(401).json("Password Not Correct");
        } else {
          res.json({
            msg: true,
          });
        }
      }
    }
  );
});

router.put(`/changePassword/:newPass/:userId`, async (req, res) => {
  const password = req.params.newPass;
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const newPassword = await bcrypt.hash(password, salt);
  const userId = req.params.userId;
  pool.query(
    `update user_data set password = $1 where id = $2`,
    [newPassword, userId],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: " Error changing password" });
      } else {
        res.json({
          msg: "Password Changed Successfully",
        });
      }
    }
  );
});

router.get("/recipe-count/:id", (req, res) => {
  const userId = req.params.id;
  pool.query(
    `select count(*) from recipe where user_id = $1`,
    [userId],
    (error, result) => {
      if (error) {
        console.error("Error fetching user-data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const num = result.rows[0];
        res.json({
          count: num.count,
        });
      }
    }
  );
});

router.put("/recipe/update/:recipeId/:newRating/:total", (req, res) => {
  const recipe_id = req.params.recipeId;
  const rating = req.params.newRating;
  const total = req.params.total;
  pool.query(
    `update recipe set rating = $1, total_ratings = $2 where id = $3`,
    [rating, total, recipe_id],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json({
          msg: "ratings updated",
        });
      }
    }
  );
});

router.get("/recipes/:id", (req, res) => {
  const recipeId = req.params.id;
  pool.query(
    `SELECT * FROM recipe WHERE id = $1`,
    [recipeId],
    (error, result) => {
      if (error) {
        console.error("Error fetching recipe:", error);
      } else {
        if (result.rows.length === 0) {
          console.error(error);
        } else {
          const recipe = result.rows[0];
          res.json({
            id: recipe.id,
            title: recipe.name,
            image: recipe.image,
            rating: recipe.rating,
            cuisine: recipe.cuisine,
            time: recipe.total_time,
            meal_type: recipe.meal_type,
            difficulty: recipe.difficulty,
            ingredients: recipe.ingredients,
            count: recipe.total_ratings,
            instructions: recipe.instructions,
            description: recipe.description,
            preparationTime: recipe.preparation_time,
            cookingTime: recipe.cooking_time,
            servings: recipe.servings,
            courseType: recipe.course_type,
            status: recipe.status,
            chef: recipe.user_id,
          });
        }
      }
    }
  );
});

router.put("/edit-profile", async (req, res) => {
  try {
    const { userId, phone, fName, lName, about, gender, address } = req.body;
    const updatedProfile = await pool.query(
      `UPDATE user_data
      SET
        first_name = $1,
        last_name = $2,
        address = $3,
        gender = $4,
          phone_number = $5,
          about = $6
      WHERE
          id = $7
      RETURNING *;
      `,
      [fName, lName, address, gender, phone, about, userId]
    );
    res.json(updatedProfile.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/culinarian", (req, res) => {
  pool.query(
    `
  select user_data.first_name as f_name, user_data.last_name as l_name, culinarian.specialization, culinarian.bio, culinarian.id, culinarian.user_id , culinarian.status from culinarian join user_data on culinarian.user_id = user_data.id `,
    [],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Error Fetching Data" });
      } else {
        const hasData = result.rows.length > 0;
        res.json({
          data: result.rows,
          count: hasData,
        });
      }
    }
  );
});

router.put("/culinarian/:status/:id", async (req, res) => {
  const stat = req.params.status;
  const id = req.params.id;
  if (stat === "Accepted") {
    try {
      const queryResult = await pool.query(
        "SELECT user_id FROM culinarian WHERE id = $1",
        [id]
      );

      if (queryResult.rows.length > 0) {
        const user_id = queryResult.rows[0].user_id;
        await pool.query(
          "UPDATE user_data SET role = 'culinarian' WHERE id = $1",
          [user_id]
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  if (stat === "Rejected") {
    try {
      const queryResult = await pool.query(
        "SELECT * FROM culinarian WHERE id = $1",
        [id]
      );

      if (queryResult.rows.length > 0) {
        const user_id = queryResult.rows[0].user_id;
        if (user_id) {
          await pool.query("UPDATE user_data SET role = 'user' WHERE id = $1", [
            user_id,
          ]);
        } else {
        }
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  pool.query(
    `update culinarian set status = $1 where id = $2`,
    [stat, id],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Cannot Update Status" });
      } else {
        res.json({ result });
      }
    }
  );
});

router.get(`/ratings/:recipeId/:userId`, (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.params.userId;
  pool.query(
    `select rating from ratings where recipe_id = $1 and user_id = $2`,
    [recipeId, userId],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "cannot fetch data" });
      } else {
        const hasData = result.rows.length > 0;
        let count;
        if (hasData === true) count = result.rows[0].rating;
        else count = 0;
        res.json({ rating: count });
      }
    }
  );
});

router.post(`/ratings/post/:recipeId/:userId/:rating`, (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.params.userId;
  const Rating = req.params.rating;
  pool.query(
    `insert into ratings(user_id, recipe_id, rating) values ($1, $2, $3)`,
    [userId, recipeId, Rating],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "cannot update ratings" });
      } else {
        res.json("Success");
      }
    }
  );
});

router.put(`/ratings/update/:recipeId/:userId/:newRating`, (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.params.userId;
  const newRating = req.params.newRating;
  pool.query(
    `update ratings set rating = $1 where recipe_id = $2 and user_id = $3`,
    [newRating, recipeId, userId],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "cannot update ratings" });
      } else {
        res.json("Success");
      }
    }
  );
});

router.post(`/notification/:id/:message/:reason`, (req, res) => {
  const userId = req.params.id;
  const message = req.params.message;
  const reason = req.params.reason;
  pool.query(
    `insert into notification(user_id, message, reason) values ($1, $2, $3)`,
    [userId, message, reason],
    (error, result) => {
      if (error) {
        res
          .status(500)
          .json({ error: "cannot update notification", ress: result });
      } else {
        res.json("Success");
      }
    }
  );
});

module.exports = router;
