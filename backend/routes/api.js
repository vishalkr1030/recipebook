const router = require("express").Router();
const db = require("../dbconfig");
const path = require("path");
const bcrypt = require("bcrypt");
const jwtgenerator = require("../JwtToken/jwtgenerator");
const Authorize = require("../middleware/authorization");
const allRecipes = require("../middleware/allRecipes");
const mailservice = require("../services/registrationservices");
const getSavedRecipes = require("../middleware/getSavedRecipe");
const saveRecipe = require("../middleware/savedRecipe");
const randomize = require("randomatic");
const {
  getRecipeRequests,
  handleRecipeRequest,
} = require("../middleware/recipeRequest");

router.get("/recipe-requests", async (req, res) => {
  try {
    const result = await getRecipeRequests();
    res.send(result);
  } catch (error) {
    console.error("error recieving reicpes ", error);
    res.send("Unable to get recipe requests");
  }
});

router.post("/recipe-response/:recipeId", async (req, res) => {
  try {
    let result = await handleRecipeRequest(
      req.params.recipeId,
      req.body.isAccept ? "Accepted" : "Rejected"
    );
    const recipeDetail = await db.query(
      "select user_id,name from recipe where id = $1",
      [req.params.recipeId]
    );
    let msg;
    if (req.body.message) {
      msg = `${recipeDetail.rows[0].name}: Your recipe has been accepted`;
    } else {
      msg =`${recipeDetail.rows[0].name}: Your recipe has been Rejected`;
    }
    await db.query(
      "INSERT INTO notifications(user_id, recipe_id, reason) VALUES ($1, $2, $3)",
      [recipeDetail.rows[0].user_id, req.params.recipeId, msg]
    );
    res.send(result);
  } catch (error) {
    console.error("Error handling recipe request", error);
    res.send("Server error : Recipe request error");
  }
});

router.get("/recipes/all", async (req, res) => {
  try {
    let result = await allRecipes(req.query.searchText, {
      mealType: req.query.mealType,
      course: req.query.course,
      cuisine: req.query.cuisine,
      rating: req.query.rating,
      culinarian: req.query.culName,
    });
    res.send(result);
  } catch (error) {
    console.error("error recieving recipes ", error);
    res.send("Server error");
  }
});

router.get("/:userId/saved-recipes", async (req, res) => {
  try {
    let result = await getSavedRecipes(
      req.params.userId,
      req.query.searchText,
      {
        mealType: req.query.mealType,
        course: req.query.course,
        cuisine: req.query.cuisine,
        rating: req.query.rating,
      }
    );
    res.send(result);
  } catch (error) {
    res.send("Server error");
  }
});

router.post("/:userId/save-a-recipe", async (req, res) => {
  const result = await saveRecipe(
    req.params.userId,
    req.body.recipeId,
    req.body.date
  );
  res.send(result);
});

router.post("/register", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      address,
      gender,
      dob,
      phonenumber,
      password,
      repassword,
    } = req.body;
    if (repassword === password) {
      const registration = await db.query(
        "SELECT * FROM user_data WHERE email = $1",
        [email]
      );
      if (registration.rows.length > 0) {
        return res.status(401).send("User already exists");
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const bcryptPassword = await bcrypt.hash(password, salt);
      const role = "user";
      await db.query(
        "INSERT INTO user_data(first_name, last_name, email, address, gender, dob, role, phone_number, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)",
        [
          firstname,
          lastname,
          email,
          address,
          gender,
          dob,
          role,
          phonenumber,
          bcryptPassword,
        ]
      );
      const newUserQuery = await db.query(
        "SELECT * FROM user_data WHERE email = $1",
        [email]
      );
      const newUser = newUserQuery.rows[0];
      mailservice.sendmail(
        email,
        "Cook Buddy",
        `${newUser.first_name} Thank you for registration with us`
      );
      const status = true;
      res.json({ status });
    } else {
      return res.status(401).send("Password Mismatch");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const status = await db.query("select * from user_data where email = $1", [
      email,
    ]);
    if (status.rows.length == 0) {
      return res.status(401).json("Password or Email is incorrect");
    }
    const passwordStatus = await bcrypt.compare(
      password,
      status.rows[0].password
    );
    if (!passwordStatus) {
      return res.status(401).json("Password or Email is in correct");
    }
    const token = jwtgenerator(status.rows[0].id);
    const user_id = status.rows[0].id;
    const role = status.rows[0].role;
    const body = {
      token,
      role,
      user_id,
    };
    res.json(body);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/user-profile/:id", (req, res) => {
  const userId = req.params.id;
  db.query(
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
            pass: user.password,
          });
        }
      }
    }
  );
});

router.get("/notification", (req, res) => {
  try {
    const notification = {
      timestamp: "2024-03-23",
      message: "hello",
    };
    res.send(notification);
  } catch (error) {
    console.error(error);
  }
});


router.post("/OtpVerify", async (req, res) => {
  try {
    const { Email } = req.body;
    const check = await db.query("SELECT * FROM user_data WHERE email = $1", [
      Email,
    ]);
    if (check.rows.length > 0) {
      otp = randomize("0", 4);
      mailservice.sendmail(
        Email,
        "Here the OTP to verify the Account",
        `${otp}`
      );
      const SendOtp = {
        otp,
      };
      res.json(SendOtp);
    } else {
      return res.status(401).json(`user not exist`);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/ChangePassword", async (req, res) => {
  try {
    const { email, Password, repassword } = req.body;
    if (Password == repassword) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const bcryptPassword = await bcrypt.hash(Password, salt);
      const status = await db.query(
        "update user_data set password = $1 where email = $2",
        [bcryptPassword, email]
      );
      mailservice.sendmail(email, "Password as been changed", `Thank You`);
      const verify = true;
      res.json({ verify });
    } else {
      return res.status(401).send("Password Mismatch");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/culinarianAccepted", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM user_data WHERE role = 'culinarian'`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});

router.get("/getdata", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM recipe where status='Accepted'"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/is-verify", Authorize, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.post("/Checkrole", async (req, res) => {
  try {
    const { id } = req.body;
    const check = await db.query("select * from user_data where id = $1", [id]);
    if (check.rows.length > 0) {
      res.json(check.rows[0].role);
    }
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/culinarian", async (req, res) => {
  try {
    let { user_id, selectedSpecializations, bio } = req.body;
    const currentDate = new Date();
    await db.query(
      "INSERT INTO culinarian(user_id,requestdate,specialization,bio) values ($1,$2,$3,$4)",
      [user_id, currentDate, selectedSpecializations, bio]
    );
    const request = await db.query(
      "SELECT first_name FROM  user_data WHERE id = $1",
      [user_id]
    );
    const firstName = request.rows[0].first_name;
    res.json(firstName);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/check-user", async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const accepted = await db.query(
      "SELECT * FROM culinarian WHERE user_id = $1 AND status = 'Accepted'",
      [user_id]
    );
    if (accepted.rows.length > 0) {
      return res.json(accepted.rows[0]);
    }
    const queryResult = await db.query(
      "SELECT * FROM culinarian WHERE user_id = $1 and status = 'Pending'",
      [user_id]
    );
    if (queryResult.rows.length > 0) {
      res.json(queryResult.rows[0]);
    }
    const query = await db.query(
      "SELECT * FROM culinarian WHERE user_id = $1",
      [user_id]
    );
    if (query.rows.length > 0) {
      res.json(query.rows[0]);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
});

module.exports = router;
