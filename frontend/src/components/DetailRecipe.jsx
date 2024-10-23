import React, { useState, useEffect } from "react";
import axios from "axios";
import Rating from "./Rating";
import Header from "./Header";
import { useParams } from "react-router";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import DeleteRecipe from "./DeleteRecipe";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
function Detailrecipe() {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const userId = Cookies.get("user_id");
  const role = Cookies.get("role");
  const [userRole, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [recipeStatus, setRecipeStatus] = useState("");
  const notify = (message) => toast(message);
  useEffect(() => {
    if (role === "user") {
      setUser("user");
    } else if (role === "admin" || role === "Admin") {
      setUser("Admin");
    } else {
      const url = `http://localhost:1200/api/detail/User-role/${recipeId}/${userId}`;
      axios
        .get(url)
        .then((response) => {
          setUser(response.data.role);
        })
        .catch((error) => {
          navigate("/dashboard");
          console.error(error);
        });
    }
  }, [role, userRole, recipeId, userId, navigate]);
  const [recipe, setRecipe] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:1200/api/detail/recipes/${recipeId}`)
      .then((response) => {
        setError(response.data.error);
        if (error) {
          notify("An Error Occured");
          navigate("/dashboard");
        }
        setRecipe(response.data);
        setRecipeStatus(recipe.status);
      })
      .catch((error) => {
        notify("An Error Occured");
        navigate("/dashboard");
      });
  }, [recipeId, error, navigate, recipe.status]);
  const handleEdit = () => {
    navigate("/edit-recipe", { state: { recipe } });
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDelete = () => {
    setShowDeleteModal(true);
  };
  const handleRequest = async () => {
    setRecipeStatus("Pending");
    notify("Requested to add recipe");
  };
  const [fav, setfav] = useState(false);
  useEffect(() => {
    axios
      .get(`http://localhost:1200/api/detail/favourites/${userId}/${recipeId}`)
      .then((response) => {
        setfav(response.data.fav);
      });
  }, [userId, recipeId]);
  const handleAddToFavourites = () => {
    try {
      const res = axios.post(
        `http://localhost:1200/api/${userId}/save-a-recipe`,
        { recipeId: recipeId, date: new Date() }
      );
    } catch (error) {
      console.error("Error checking or adding recipe to favourites:", error);
    }
    window.location.reload();
  };

  const [percentage, setPercentage] = useState("");
  useEffect(() => {
    const rate = Math.floor(recipe.rating);
    const part = (recipe.rating - rate) * 100;
    setPercentage(Math.floor(part) + "%");
  }, [recipe.rating]);

  useEffect(() => {
    if (
      recipeStatus === "Accepted" ||
      recipeStatus === "Inactive" ||
      recipeStatus === "Pending"
    )
      setStatus();
  }, [recipeStatus]);

  const setStatus = async () => {
    const updatedStatus = { recipeStatus, recipeId };
    try {
      const response = await axios.put(
        "http://localhost:1200/api/manage/status",
        updatedStatus
      );
    } catch (error) {
      console.error("Error setting recipe status:", error.message);
    }
  };
  return (
    <div class="bg-white">
      <ToastContainer/>
      <Header />
      <div class=" mx-40 mb-10 sm:my-10 px-4 pb-6 rounded-xl bg-white font-open-sans">
        {recipe ? (
          <div>
            <h2 class="font-bold ml-3 text-[60px]">{recipe.title}</h2>
            {recipe.status === "Accepted" && (
              <div className="rating-container flex justify-between mt-[-10px]">
                <div class="rating-container-rating-tab flex flex-row mt-0 justify-start items-center">
                  <p class="pl-5 pr-2 text-[20px] tracking-wide">
                    {recipe.rating}{" "}
                  </p>
                  <div className=" tracking-wide pt-1">
                    {Array.from(
                      { length: Math.floor(recipe.rating) },

                      (_, index) => (
                        <svg
                          key={index}
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-star-fill text-yellow-500 pl-2"
                          viewBox="0 0 16 17"
                          stroke="black"
                          stroke-width="1"
                        >
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                      )
                    )}

                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 17"
                      className="pl-2"
                    >
                      <defs>
                        <linearGradient id="half">
                          <stop
                            offset={percentage}
                            stop-color="rgb(234 179 8)"
                          />
                          <stop offset={percentage} stop-color="white" />
                        </linearGradient>
                      </defs>
                      <g fill="url(#half)" stroke="black" stroke-width="1">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                      </g>
                    </svg>
                    {Array.from(
                      { length: 4 - Math.floor(recipe.rating) },
                      (_, index) => (
                        <svg
                          key={index}
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-star-fill text-white pl-2"
                          viewBox="0 0 16 17"
                          stroke="black"
                          stroke-width="1"
                        >
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                      )
                    )}
                  </div>
                  <p class="pl-3 text-[20px] tracking-wide">
                    {recipe.count} Ratings
                  </p>
                </div>

                <button
                  onClick={handleAddToFavourites}
                  className="button-fav bg-transparent"
                >
                  <svg
                    width="35"
                    height="35"
                    viewBox="-16.15 -14.15 500.00 580.00"
                    class="px-1 py-1"
                  >
                    <path
                      d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                      stroke="black"
                      stroke-width="20"
                      fill={fav ? "#ff0000" : "#FFffff"}
                    />
                  </svg>
                </button>
              </div>
            )}

            <hr class="h-0.5 bg-gray-300 ml-3"></hr>
            <div class="pl-5 text-black text-left">
              <p class="mb-10 text-[20px]">{recipe.description}</p>
            </div>

            <div class="overflow-hidden position-relative ml-5 width-full">
              <img
                src={recipe.image}
                alt="RecipeIMG"
                class="w-full h-[600px] rounded-xl object-cover"
              />
            </div>

            {role === "admin" && recipe.chef === userId && (
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={handleEdit}
                  className="bg-[#3498db] text-white ml-4 font-medium px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                {showDeleteModal && <DeleteRecipe recipeId={recipeId} />}
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white font-medium px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}

            {role === "admin" &&
              recipe.chef !== userId &&
              (recipe.status === "Accepted" ||
                recipe.status === "Inactive") && (
                <div className="flex justify-end gap-4 mt-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300 mr-3">
                      Hide Recipe
                    </span>
                    <input
                      type="checkbox"
                      value={recipeStatus}
                      checked={recipeStatus === "Accepted" ? true : false}
                      className="sr-only peer"
                      onChange={(e) => {
                        setRecipeStatus((prevStatus) =>
                          prevStatus === "Accepted" ? "Inactive" : "Accepted"
                        );
                        notify(`Recipe status modified`);
                      }}
                    />
                    <div className="relative w-11 h-6 bg-red-600 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    <span className="pl-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Display recipe
                    </span>
                  </label>
                </div>
              )}

            {userRole === "culinarian" && recipe.status === "Pending" && (
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={handleEdit}
                  className="bg-[#3498db] text-white ml-4 font-medium px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
              </div>
            )}

            {userRole === "culinarian" && recipe.status === "Rejected" && (
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={handleEdit}
                  className="bg-[#3498db] text-white ml-4 w-24 font-medium px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={handleRequest}
                  className="bg-presgreen text-white ml-4 w-24 font-medium px-4 py-2 rounded-md hover:bg-green-500"
                >
                  Request
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white ml-4 w-24 font-medium px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}

            {userRole === "culinarian" && recipe.status === "Inactive" && (
              <div className="flex justify-end gap-4 mt-4 mr-5">
                <button
                  onClick={handleRequest}
                  className="bg-presgreen text-white ml-4 w-24 font-medium px-4 py-2 rounded-md hover:bg-green-500"
                >
                  Request to activate
                </button>
              </div>
            )}

            <div className="px-4 flex justify-between gap-8 text-center ml-5 mt-5 font-medium">
              <div className="bg-white text-black w-full rounded-2xl border border-text border-primary-100 shadow-4xl shadow-red-600">
                <h3>Servings</h3>
                <p>{recipe.servings}</p>
              </div>
              <div className="bg-white text-black w-full rounded-2xl border border-text border-primary-100 shadow-4xl shadow-orange-600">
                <h3>Preparation Time</h3>
                <p>{recipe.preparationTime} MINS</p>
              </div>
              <div className="bg-white text-black w-full rounded-2xl border border-text border-primary-100 shadow-4xl shadow-yellow-600">
                <h3>Cooking Time</h3>
                <p>{recipe.cookingTime} MINS</p>
              </div>

              <div className=" bg-white text-black w-full rounded-xl border border-text border-primary-100 shadow-4xl shadow-green-600">
                <h3>Cuisine</h3>
                <p>{recipe.cuisine}</p>
              </div>
              <div className="bg-white text-black w-full rounded-xl border border-text border-primary-100 shadow-4xl shadow-sky-600">
                <h3>Meal Type</h3>
                <p>{recipe.meal_type}</p>
              </div>
              <div className="bg-white text-black w-full rounded-xl border border-text border-primary-100 shadow-4xl shadow-violet-600">
                <h3>Difficulty</h3>
                <p>{recipe.difficulty}</p>
              </div>
            </div>

            <div class="ml-5 mt-4 rounded-lg px-5 py-3 text-black ">
              <strong class="text-[30px]">Ingredients</strong>

              <ul class="list list-disc px-0 list-inside">
                {Array.isArray(recipe.ingredients) ? (
                  recipe.ingredients.map((ingredient, index) => (
                    <li class="flex items-center mb-2">
                      <svg
                        class="mt-1 mr-2"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="4"
                          stroke="black"
                          stroke-width="1"
                          fill="none"
                        />
                      </svg>
                      <span class="pt-2 text-[18px]">{ingredient}</span>
                    </li>
                  ))
                ) : (
                  <li>No ingredients available</li>
                )}
              </ul>
            </div>
            <div class="ml-5 mt-4 rounded-lg px-5 py-3 text-black ">
              <div class="mb-2">
                <strong class="text-[30px] ">Instructions</strong>
              </div>

              <ul class="list list-disc px-0 list-inside">
                {Array.isArray(recipe.instructions) ? (
                  recipe.instructions.map((instruction, index) => (
                    <li class="flex flex-wrap flex-row my-2">
                      <span class=" top-2 left-0 w-6 h-6  bg-orange-500 font-medium rounded-full text-white text-center flex justify-center items-center">
                        {index + 1}
                      </span>
                      <span class="pl-3 pb-2 w-[95%] text-[18px] flex flex-wrap break-words">
                        {instruction}
                      </span>
                    </li>
                  ))
                ) : (
                  <li>No instructions available</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className="loader-container">
            <div className="loader">
              <ClipLoader size={50} color={"#123abc"} />
            </div>
          </div>
        )}
        {recipe.status === "Accepted" && <Rating recipeId={recipeId} />}
      </div>
    </div>
  );
}

export default Detailrecipe;
