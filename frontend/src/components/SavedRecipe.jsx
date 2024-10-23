import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Header from "./Header";
import { searchSavedRecipe } from "../api";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Card from "./Card";
import Container from "./Container";
import { ClipLoader } from "react-spinners";
import fields from "../data.json";
import NoRecipeFound from "./NoRecipeFound";
function SavedRecipe() {
  const { userId } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    cuisine: [],
    mealType: [],
    courseType: [],
    rating: [],
    culinarian: "",
  });
  const [verify, setVerify] = useState(false);
  const navigate = useNavigate();

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
        console.log(response.data);
        setVerify(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        navigate("/");
      });
  }, []);

  const getRecipes = async (id, text, filter) => {
    try {
      setLoading(true);
      const res = await searchSavedRecipe(id, text, filter);
      setRecipes(res.data.rows);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const setItems = (txt, filter) => {
    setSearchText(txt);
    setFilter(filter);
  };

  const cuisines = fields.cuisineTypes.map((cuisine) => ({
    name: cuisine,
    filter: cuisine,
  }));

  useEffect(() => {
    if (verify) {
      getRecipes(userId, searchText, filter);
    }
  }, [userId, searchText, filter, verify]);

  return (
    <div className="App">
      <Header />
      <div>
        <div className="flex-1 flex flex-col items-center justify-center gap-26 max-w-full text-center text-13xl text-primary-100 font-open-sans">
          <SearchBar
            onSearch={setItems}
            placeholder={"Search favorite recipes..."}
          />
        </div>
        {isLoading ? (
          <div className="loader-container">
            <div className="loader">
              <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
            </div>
          </div>
        ) : recipes.length === 0 ? (
          <NoRecipeFound />
        ) : (
          cuisines
            .filter((cuisine) =>
              recipes.some((item) => item.cuisine === cuisine.filter)
            )
            .map((cuisine) => (
              <Container key={cuisine.name} cuisineName={`${cuisine.name}`}>
                {recipes
                  .filter((item) => item.cuisine === cuisine.filter)
                  .map((item, index) => (
                    <Card
                      key={index}
                      foodName={item.name}
                      imageUrl={item.image}
                      timeTaken={`${item.total_time} mins`}
                      id={item.id}
                      rating={`${item.rating}⭐`}
                    />
                  ))}
              </Container>
            ))
        )}
      </div>
    </div>
  );
}

export default SavedRecipe;
