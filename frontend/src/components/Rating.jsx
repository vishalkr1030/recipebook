import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Rating({ recipeId }) {
  const navigate = useNavigate();
  const notify = (message) => toast(message);
  const [selectedRating, setSelectedRating] = useState(Number); 
  const [lastRating, setLastRating] = useState(Number);
  const [load, setLoad] = useState(true);
  const userId = Cookies.get("user_id");
  useEffect(() => {
    axios
      .get(`http://localhost:1200/api/detail/ratings/${recipeId}/${userId}`)
      .then((response) => {
        setLastRating(response.data.rating);
      })
      .catch((error) => {
        navigate("/dashboard");
        console.error(error);
      });
  }, [recipeId, userId, navigate]);
  const handleRatingChange = (newRating) => {
    setSelectedRating(newRating);
    setLoad(false);
  };
  const [initialAverageRating, setRating] = useState(0);
  const [total_ratings, setTotal] = useState(0);
  useEffect(() => {
    axios
      .get(`http://localhost:1200/api/detail/recipes/${recipeId}`)
      .then((response) => {
        setRating(response.data.rating);
        setTotal(response.data.count);
      })
      .catch((error) => {
        navigate("/dashboard");
        console.error(error);
      });
  }, [recipeId, navigate]);

  const submitRating = async () => {
    if (lastRating === 0) {
      const Rate = Number(total_ratings) * Number(initialAverageRating);
      const total = Number(total_ratings) + Number(1);
      const newRating = (Rate + selectedRating) / total;
      axios
        .put(
          `http://localhost:1200/api/detail/recipe/update/${recipeId}/${newRating}/${total}`
        )
        .then(() => {
          notify("Ratings Submitted. Thanks for Rating!");
        })
        .catch((error) => {
          console.error("Error in submitting review", error);
        });

      axios
        .post(
          `http://localhost:1200/api/detail/ratings/post/${recipeId}/${userId}/${selectedRating}`
        )
        .then(() => {
        })
        .catch((error) => {
          console.error(error);
          window.location.reload();
        });
    } else {
      const Rate =
        Number(total_ratings) * Number(initialAverageRating) - lastRating;
      const total = Number(total_ratings);
      const newRating = (Rate + selectedRating) / total;
      axios
        .put(
          `http://localhost:1200/api/detail/recipe/update/${recipeId}/${newRating}/${total}`
        )
        .then(() => {
          notify("Ratings Submitted. Thanks for Rating!");
        })
        .catch((error) => {
          console.error("Error in submitting review", error);
        });

      axios
        .put(
          `http://localhost:1200/api/detail/ratings/update/${recipeId}/${userId}/${selectedRating}`
        )
        .then(() => {
        })
        .catch((error) => {
          console.error("Error");
        });
    }
  };

  const ratingStars = [1, 2, 3, 4, 5];

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center">
        <h3 className="mt-8 mb-2 text-lg font-bold ">Rate this Recipe</h3>
        <div className="flex space-x-1">
          {ratingStars.map((rating) => (
            <span
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className="cursor-pointer text-3xl hover:text-yellow-200"
            >
              <svg
                width="30"
                height="30"
                stroke="black"
                stroke-width="1"
                viewBox="-2 0 20 20"
              >
                <path
                  d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                  fill={
                    rating <= selectedRating ||
                    (rating <= lastRating && load === true)
                      ? "rgb(234 179 8)"
                      : "#ffffff"
                  }
                />
              </svg>
            </span>
          ))}
        </div>
        <button
          onClick={submitRating}
          className="mt-4 bg-primary-100 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Submit Rating
        </button>
      </div>
    </>
  );
}

export default Rating;
