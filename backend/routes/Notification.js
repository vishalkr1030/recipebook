const router = require("express").Router();
const db = require("../dbconfig");

router.get("/notification", async (req, res) => {
  try {
    const requires = await db.query(
      "select * from user_data where role='admin'"
    );
    res.json(requires.rows[0].id);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/notification1", async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await db.query(
      `
      SELECT n.*, u.first_name ,u.role
      FROM notifications AS n
      JOIN user_data AS u ON n.user_id = u.id
      WHERE n.user_id = $1
  `,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching notification data:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/notification", async (req, res) => {
  try {
    const requires = await db.query(
      "select * from user_data where role='admin'"
    );
    res.json(requires.rows[0].id);
  } catch (err) {
    console.error(err.message);
  }
});
router.get("/notification1", async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await db.query(
      `
      SELECT n.*, u.first_name 
      FROM notifications AS n
      JOIN user_data AS u ON n.user_id = u.id
      WHERE n.user_id = $1
  `,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching notification data:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notification", async (req, res) => {
  try {
    const { user_id, reason } = req.body;
    await db.query(
      "INSERT INTO notifications(user_id, reason) VALUES ($1, $2)",
      [user_id, reason]
    );
    res.status(201).json({ message: "Notification created successfully" });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notifications", async (req, res) => {
  try {
    const { user_id, recipe_id, reason } = req.body;
    await db.query(
      "INSERT INTO notifications(user_id, recipe_id, reason) VALUES ($1, $2, $3)",
      [user_id, recipe_id, reason]
    );

    res.status(201).json({ message: "Notification created successfully" });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
