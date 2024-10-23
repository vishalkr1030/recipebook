import React from "react";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import "./index.css";
import "./styles.css";
import Dashboard from "./components/Dashboard.jsx";
import Footer from "./components/Footer.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProfile from "./components/UserProfile.jsx";
import DetailRecipe from "./components/DetailRecipe.jsx";
import SavedRecipe from "./components/SavedRecipe.jsx";
import AddRecipe from "./components/AddRecipe.jsx";
import UpdateRecipe from "./components/UpdateRecipe.jsx";
import RecipeRequest from "./components/RecipeRequest.jsx";
import Culinarian from "./components/Culinarian.jsx";
import MyRecipes from "./components/MyRecipes.jsx";

function App() {
  return (
    <div className="flex flex-col h-screen justify-between">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/recipe-request" element={<RecipeRequest />} />
          <Route
            path="user/detail-recipe/:recipeId"
            element={<DetailRecipe />}
          />
          <Route path="/api/:userId/saved-recipes" element={<SavedRecipe />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit-recipe" element={<UpdateRecipe />} />
          <Route path="/culinarianReq" element={<Culinarian />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
