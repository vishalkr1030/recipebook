import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Card from "./Card";
import Container from "./Container";
import Cookies from "js-cookie";
import RecipeContainer from "./RecipeContainer";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import NoRecipeFound from "./NoRecipeFound";

export default function MyRecipes() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const role = Cookies.get("role");
  const userId = Cookies.get("user_id");
  const [showAll, setShowAll] = useState(true);
  const [verify, setVerify] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("Accepted");
  function handleClick(selectedLabel) {
    setSelectedStatus(selectedLabel);
  }
  const containerRef = useRef(null);
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
        setVerify(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        navigate("/");
      });
  }, []);

  useEffect(() => {
    if (verify) {
      getRecipes();
    }
  }, [verify]);

  const getRecipes = async (
    searchText = "",
    filter = {
      rating: [],
      mealType: [],
      courseType: [],
      cuisine: [],
    }
  ) => {
    try {
      const queryString = (filter, arr) =>
        arr.map((item) => `${filter}=${item}`).join("&");
      const qry = `http://localhost:1200/api/manage/myrecipes/${userId}/?searchText=${searchText}&${queryString(
        "rating",
        filter.rating || []
      )}&${queryString("mealType", filter.mealType || [])}&${queryString(
        "course",
        filter.courseType || []
      )}&${queryString("cuisine", filter.cuisine || [])}`;
      const response = await axios.get(qry);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cuisines = [
    { name: "North Indian", filter: "North Indian" },
    { name: "Continental", filter: "Continental" },
    { name: "Chinese", filter: "Chinese" },
    { name: "Japanese", filter: "Japanese" },
    { name: "Italian", filter: "Italian" },
  ];

  return (
    <>
      <div>
        <div className="dashboard-container overflow-y-auto">
          <Header />
          <div className="flex-1 flex flex-col items-center justify-center gap-26 max-w-full text-center text-13xl text-primary-100 font-open-sans">
            <SearchBar
              onSearch={getRecipes}
              allRecipe={setShowAll}
              placeholder={"Search your recipes..."}
            />
          </div>
          {data.length === 0 ? (
            <NoRecipeFound />
          ) : (
            <>
              {role === "culinarian" && (
                <div className="mx-20">
                  <nav className="flex gap-4 mt-10 ml-10 font-open-sans">
                    <span
                      className={`cursor-pointer py-2 px-4 rounded-md ${
                        selectedStatus === "Accepted"
                          ? "bg-primary-100 text-white"
                          : "text-black"
                      }`}
                      onClick={() => handleClick("Accepted")}
                    >
                      Accepted
                    </span>
                    <span
                      className={`cursor-pointer py-2 px-4 rounded-md ${
                        selectedStatus === "Pending"
                          ? "bg-yellow-500 text-white"
                          : "text-black"
                      }`}
                      onClick={() => handleClick("Pending")}
                    >
                      Pending
                    </span>
                    <span
                      className={`cursor-pointer py-2 px-4 rounded-md ${
                        selectedStatus === "Inactive"
                          ? "bg-gray-500 text-white"
                          : "text-black"
                      }`}
                      onClick={() => handleClick("Inactive")}
                    >
                      Inactive
                    </span>
                    <span
                      className={`cursor-pointer py-2 px-4 rounded-md ${
                        selectedStatus === "Rejected"
                          ? "bg-red-500 text-white"
                          : "text-black"
                      }`}
                      onClick={() => handleClick("Rejected")}
                    >
                      Rejected
                    </span>
                  </nav>
                  <hr className="h-1 bg-gray-400 ml-3"></hr>
                </div>
              )}
              {isLoading ? (
                <div className="loader-container">
                  <div className="loader">
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                  </div>
                </div>
              ) : (
                cuisines
                  .filter((cuisine) =>
                    data && Array.isArray(data)
                      ? data.some(
                          (item) =>
                            item.cuisine === cuisine.filter &&
                            item.status === selectedStatus
                        )
                      : false
                  )
                  .map((cuisine) => (
                    <div key={cuisine.name} ref={containerRef}>
                      <Container cuisineName={`${cuisine.name}`}>
                        {data
                          .filter(
                            (item) =>
                              item.cuisine === cuisine.filter &&
                              item.status === selectedStatus
                          )
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
                    </div>
                  ))
              )}
            </>
          )}
        </div>
      </div>
      <div style={{ height: "100px" }}></div>
    </>
  );
}
