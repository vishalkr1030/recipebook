import axios from "axios";
import React, { useState, useEffect } from "react";
import ManageRecipes from "./ManageRecipes";
import Header from "./Header";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddRecipe = () => {
  const userId = Cookies.get("user_id");
  const notify = (message) => toast(message);
  const Navigate = useNavigate();
  const [verify, setVerify] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = Cookies.get("token");
    axios
      .get("http://localhost:1200/api/is-verify", {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      })
      .then((response) => {
        setVerify(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        Navigate("/");
      });
  }, []);

  const addRecipe = async (recipe) => {
    const role = Cookies.get("role");
    let status = "Pending";
    if (role === "admin") status = "Accepted";
    if (verify) {
      const newRecipe = { ...recipe, userId, status };
      try {
        const response = await axios.post(
          "http://localhost:1200/api/manage/add",
          newRecipe
        );
        if (role === "admin") 
        {
        notify("Recipe added successfully!");
        }
        else 
        {
          notify("Request sent to add recipe");
             
        }
        setTimeout(() => {
          Navigate("/dashboard");
        }, 2000);
      } catch (error) {
        console.error("Error adding recipe:", error.message);
      }
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <ToastContainer />
      <ManageRecipes handleSubmit={addRecipe} />
    </div>
  );
};

export default AddRecipe;
