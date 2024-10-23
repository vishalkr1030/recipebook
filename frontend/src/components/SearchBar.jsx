import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import Notification from "./Notification";
import data from "../data.json";
import { useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
const SearchBar = ({
  onSearch,
  placeholder = "What are you looking to cook today...",
}) => {
  const location = useLocation();
  const pageRoute = location.pathname;
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    cuisine: [],
    mealType: [],
    courseType: [],
    rating: [],
    culinarian: "",
  });
  const [culinarians, setCulinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const { courseTypes, cuisineTypes, ratings } = data;
  useEffect(() => {
    fetchCulinarians();
  }, []);
  //to fetch culinarians
  const fetchCulinarians = async () => {
    try {
      const response = await fetch(
        "http://localhost:1200/api/culinarianAccepted"
      );
      const data = await response.json();
      setCulinarians(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching culinarians:", error);
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterType]: selectedFilters[filterType].includes(value)
        ? selectedFilters[filterType].filter((filter) => filter !== value)
        : [...selectedFilters[filterType], value],
    });
  };
  const handleCulinarianChange = (event) => {
    setSelectedFilters({
      ...selectedFilters,
      culinarian: event.target.value,
    });
  };
  const handleApplyFilters = () => {
    onSearch(searchTerm, selectedFilters);
    toggleSidebar();
  };
  const handleCancelFilters = () => {
    setSelectedFilters({
      cuisine: [],
      mealType: [],
      courseType: [],
      rating: [],
      culinarian: "",
    });
    toggleSidebar();
  };

  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
  };
  const handleResetFilters = () => {
    setSelectedFilters({
      cuisine: [],
      mealType: [],
      courseType: [],
      rating: [],
      culinarian: "",
    });
  };

  React.useEffect(() => {
    onSearch(searchTerm, selectedFilters);
  }, [searchTerm]);

  return (
    <div
      className="flex justify-end items-center mt-4 mb-4 mr-4"
      style={{ marginTop: "50px" }}
    >
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          className="w-96 px-15 py-2 rounded-lg text-primary-300 bg-textbg focus:outline-none ml-[-20px] border-none drop-shadow-xl shadow-primary-300/50"
          style={{ width: "700px" }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-6 absolute right-6 top-1/2 ml-5 mt-1.5 transform -translate-y-1/2 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 3a5 5 0 100 10 5 5 0 000-10zM0 8a8 8 0 1114.23 4.77l5.72 5.73-1.41 1.41-5.73-5.72A8 8 0 010 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 ml-8 mt-2 text-white bg-primary-300 rounded-md drop-shadow-2xl hover:cursor-pointer"
        viewBox="0 0 20 20"
        fill="currentColor"
        onClick={toggleSidebar}
      >
        <path
          fillRule="evenodd"
          d="M5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM5 12a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {sidebarVisible && (
        <div
          className="fixed top-0 right-0 h-full  w-80 bg-white z-10 rounded-lg drop-shadow-2xl overflow-hidden overflow-y-auto"
          style={{ marginTop: "40px" }}
        >
          <div className="text-primary-300 p-4  ">
            <div className="flex items-center gap-20">
              <h4 className="text-lg font-semibold font-open-sans flex items-start">
                Filters
              </h4>
              <button
                className="px-3 py-2 bg-gray-300 text-primary-300 rounded-md hover:bg-primary-600 focus:outline-none ml-2"
                onClick={handleResetFilters}
              >
                Reset
              </button>
            </div>
            <div className="mb-4">
              <h6 className="text-sm font-semibold mb-4 ml-0 mr-12 mt-[-2rem] flex flex-start">
                Cuisine
              </h6>

              <ul className="list-none pl-0  ">
                <div className="grid grid-cols-2 mt-[-2rem] items-start">
                  {cuisineTypes.map((cuisine) => (
                    <div
                      key={cuisine}
                      className={`flex items-center justify-center mb-3 w-5/6 pl-4 ${
                        selectedFilters.cuisine.includes(cuisine)
                          ? "bg-gray-200"
                          : ""
                      }`}
                      onClick={() => handleFilterChange("cuisine", cuisine)}
                      style={{
                        cursor: "pointer",
                        borderRadius: "0.5rem",
                        padding: "0.5rem 0.5rem",
                      }}
                    >
                      <label className="text-base cursor-pointer hover:cursor-pointer pl-2">
                        {cuisine}
                      </label>
                    </div>
                  ))}
                </div>
              </ul>
            </div>
            <div className="mb-4">
              <h6 className="text-sm font-semibold mb-4 ml-0 mr-12 mt-[-1rem] flex flex-start">
                Meal Type
              </h6>
              <div className="grid grid-cols-2">
                <div
                  className={`flex items-center justify-center mb-3 w-5/6 pl-4 ${
                    selectedFilters.mealType.includes("Veg")
                      ? "bg-gray-200 "
                      : ""
                  }`}
                  onClick={() => handleFilterChange("mealType", "Veg")}
                  style={{
                    cursor: "pointer",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 0.5rem",
                  }}
                >
                  <label className="text-base cursor-pointer hover:cursor-pointer">
                    Veg
                  </label>
                </div>
                <div
                  className={`flex items-center justify-center mb-3 w-5/6 pl-4 ${
                    selectedFilters.mealType.includes("Non-veg")
                      ? "bg-gray-200 "
                      : ""
                  }`}
                  onClick={() => handleFilterChange("mealType", "Non-veg")}
                  style={{
                    cursor: "pointer",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 0.5rem",
                  }}
                >
                  <label className="text-base cursor-pointer hover:cursor-pointer">
                    Non-veg
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h6 className="text-sm font-semibold mb-4 ml-0 mr-12 flex flex-start mt-[-0.5rem]">
                Course Type
              </h6>
              <div className="grid grid-cols-2">
                {courseTypes.map((courseType) => (
                  <div
                    key={courseType}
                    className={`flex items-center justify-center mb-3 w-5/6 pl-4 ${
                      selectedFilters.courseType.includes(courseType)
                        ? "bg-gray-200 "
                        : ""
                    }`}
                    onClick={() => handleFilterChange("courseType", courseType)}
                    style={{
                      cursor: "pointer",
                      borderRadius: "0.5rem",
                      padding: "0.5rem 0.5rem",
                    }}
                  >
                    <label className="text-base cursor-pointer hover:cursor-pointer">
                      {courseType}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h6 className="text-sm font-semibold mb-1 ml-0 mr-12 flex flex-start mt-[1rem]">
                  Rating
                </h6>
                {ratings.map((rating) => (
                  <div
                    className="flex items-center ml-9 mb-3"
                    key={rating.value}
                  >
                    <input
                      className="text-sm mt-[0.5rem] h-3 w-3 ml-1 mr-2 border rounded-lg checked:bg-primary-100 checked:border-transparent"
                      type="checkbox"
                      id={`rating${rating.value}`}
                      name={`rating${rating.value}`}
                      value={rating.value}
                      checked={selectedFilters.rating.includes(rating.value)}
                      onChange={() =>
                        handleFilterChange("rating", rating.value)
                      }
                    />
                    <label
                      htmlFor={`rating${rating.value}`}
                      className="text-base cursor-pointer hover:cursor-pointer"
                    >
                      {rating.label}
                    </label>
                  </div>
                ))}
              </div>
              {pageRoute !== "/my-recipes" && (
                <div className="mt-4">
                  <h6 className="text-sm font-semibold mb-4 ml-0 mr-12 flex flex-start mt-[1rem]">
                    Culinarian
                  </h6>
                  {loading ? (
                    <div className="loader-container">
                      <div className="loader">
                        <ClipLoader
                          size={50}
                          color={"#123abc"}
                          loading={loading}
                        />
                      </div>
                    </div>
                  ) : (
                    <select
                      value={selectedFilters.culinarian}
                      onChange={handleCulinarianChange}
                      className="text-base w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-primary-300"
                    >
                      <option value="">Select culinarian</option>
                      {culinarians.map((culinarian) => (
                        <option
                          key={culinarian.id}
                          value={culinarian.first_name}
                        >
                          {culinarian.first_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-center gap-5 mb-8 p-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-400 focus:outline-none"
                onClick={handleCancelFilters}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 mr-2 bg-primary-100 text-white rounded-md hover:bg-primary-600 focus:outline-none"
                onClick={handleApplyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
