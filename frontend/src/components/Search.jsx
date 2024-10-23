import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
const Search = ({ allRecipe, setData = (a) => a }) => {
  const [role, setRole] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  
//to fetch recipes
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:1200/api/recipes/all");
      setSearchResults(response.data.rows);
      // setOriginalData(response.data); // Store original data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
// for search and filter
  const handleSearch = async (
    query = "",
    filters = {
      cuisine: [],
      mealType: [],
      courseType: [],
      rating: [],
      culinarian: "",
    }
  ) => {
    try {
      const queryString = (filter, arr) =>
        arr.map((item) => `${filter}=${item}`).join("&");
      const qry = `http://localhost:1200/api/recipes/all?searchText=${query}&${queryString(
        "rating",
        filters.rating
      )}&${queryString("mealType", filters.mealType)}&${queryString(
        "course",
        filters.courseType
      )}&${queryString("cuisine", filters.cuisine)}&culName=${
        filters.culinarian
      }`;
      const res = await axios.get(qry);
      setSearchResults(res.data.rows);
      setData(res.data.rows);
    } catch (error) {
      console.error(error);
    }
  };
  const [buttonPosition, setButtonPosition] = useState("bottom-[90px]");
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const pageHeight = document.body.scrollHeight;
      if (pageHeight - window.scrollY <= windowHeight) {
        setButtonPosition("bottom-[150px]");
      } else {
        setButtonPosition("bottom-[90px]");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  useEffect(() => {
    fetchData();

    const type = Cookies.get("role");
    if (type) {
      setRole(type);
    }
  }, []);
  return (
    <>
      {role !== "user" && (
        
        <div
          className={`fixed ${buttonPosition} right-[80px] ${
            isHovered ? "w-[150px] h-[50px]" : " w-[70px] h-[70px]"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/add-recipe">
            <button
              className={`bg-primary-100 hover:cursor-pointer text-white font-open-sans text-xl w-full h-full shadow-md shadow-primary-100 
              ${isHovered ? "rounded-lg" : " rounded-full"}`}
            >
              {isHovered ? (
                "Add Recipe"
              ) : (
                <span className="text-[45px]">+</span>
              )}
            </button>
          </Link>
        </div>
      )}
      <div className="flex-1 flex flex-col items-center justify-center gap-26 max-w-full text-center text-13xl text-primary-100 font-open-sans relative">
        <SearchBar onSearch={handleSearch} allRecipe={allRecipe} />
      </div>
    </>
  );
};

export default Search;
