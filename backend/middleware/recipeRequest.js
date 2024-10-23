const pool = require("../dbconfig");

const getRecipeRequests = () => {
  return pool.query(
    "select r.id,u.first_name,u.last_name,r.name,r.cuisine,r.total_time,r.image,r.meal_type,r.status from recipe r join user_data u on r.user_id = u.id and u.role != 'admin'"
  );
};

const handleRecipeRequest = (id, status) => {
  return pool.query("UPDATE recipe SET status=$1 WHERE id=$2", [status, id]);

};

module.exports = {
  getRecipeRequests,
  handleRecipeRequest,
};
