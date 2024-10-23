const pool = require("../dbconfig");

async function getSavedRecipes(userId, searchText = "", filter) {
  const arrayReduce = (arr) => {
    let out = "";
    arr.map((item) => (out += `,'${item}'`));
    return out.substring(1);
  };
  let culId;
  if (filter.culinarian) {
    const temp = await pool.query(
      `select id from user_data where lower(first_name) IN (${
        Array.isArray(filter.culinarian)
          ? arrayReduce(filter.culinarian)
          : `'${filter.culinarian}'`
      })`
    );
    culId = temp.rows.map((row) => row.id);
  }

  const filterQryConstruct = (filter, value) =>
    ` and ${filter} IN (${value ? arrayReduce(value) : ""})`;
  const ratingQry = (value) => `and r.rating >= ${value}`;
  const qry = `select r.id, r.image, r.total_time, r.name, r.cuisine
      from recipe r JOIN favorites f ON r.id = f.recipe_id 
      where f.user_id = '${userId}'
        and r.name ilike '%${searchText}%' 
        ${filter.rating ? ratingQry("rating", filter.rating) : ""} 
        ${filter.culinarian ? ` and r.user_id IN (${arrayReduce(culId)})` : ""}
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
        }`;
  const res = await pool.query(qry);
  return res;
}

module.exports = getSavedRecipes;
