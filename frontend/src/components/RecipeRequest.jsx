import React from "react";
import Header from "./Header";
import { getRecipeRequests, recipeResponse } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import PopupDialog from "./PopupDialog";

const RecipeRequest = () => {
  const [recReq, setRecReq] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const notify = (message) => toast(message);
  const [isPopupOpen, setPopup] = React.useState(false);
  const [rejectId, setrejectId] = React.useState();
  const [curRecipe, setRecipe] = React.useState();
  const getRequests = async () => {
    setLoading(true);
    try {
      const result = await getRecipeRequests();
      setLoading(false);
      setRecReq(result.data.rows);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleRecipeAction = async (isAccept, id, name, message = "") => {
    try {
      const res = await recipeResponse(isAccept, id, name, message);
      notify(`Recipe ${isAccept ? "Accepted" : "Rejected"}`);
      setrejectId("");
      setRecipe("");
      getRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const closePopup = () => setPopup(false);

  React.useEffect(() => {
    getRequests();
  }, []);

  const getTagClass = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-300";
      case "Rejected":
        return "bg-red-300";
      case "Pending":
        return "bg-amber-300";
      default:
        return "bg-blue-300";
    }
  };

  const RequestCard = ({
    id,
    image,
    culName,
    recipeName,
    cuisine,
    totalTime,
    status,
  }) => (
    <div
      className="font-open-sans flex h-48 lg:w-3/4 items-center bg-white hover:drop-shadow-2xl relative rounded-xl text-darkslategray-100 gap-10 md:w-5/6 sm:w-11/12"
      key={id}
    >
      <div className="h-40 w-48 p-4 rounded-lg rounded-md">
        <Link className="no-underline" to={`/user/detail-recipe/${id}`}>
          <img
            src={image}
            className="h-40 w-48 rounded-md hover:bg-gray-200"
            alt="Recipe"
          />
        </Link>
      </div>
      <div className="w-1/6 text-xl font-semibold text-gray-900">{culName}</div>
      <div className="w-3/6 flex flex-col gap-3 ">
        <p className="text-xl font-bold text-gray-900 line-clamp-2">
          Recipe Name: {recipeName}
        </p>
        <div className="text-base text-gray-700">Cuisine: {cuisine}</div>
        <div className="text-base text-gray-700">
          Total Time: {totalTime} minutes
        </div>
      </div>
      <div
        className={`font-sans w-2/6 lg:flex lg:flex-row sm:flex-col md:flex-col justify-center items-center`}
      >
        <p
          className={`font-open-sans min-w-24 rounded min-h-8 text-center pt-2  ${
            getTagClass(status)
          }`}
        >
          {status}
        </p>
      </div>
      <div className="w-48 lg:flex lg:flex-row sm:flex-col md:flex-col justify-center items-center">
        {status === "Pending" ? (
          <>
            <button
              className="font-open-sans bg-primary-100 hover:bg-primary-300 text-white px-4 py-2 rounded-md mr-4"
              onClick={() => handleRecipeAction(true, id)}
            >
              Accept
            </button>
            <button
              className="font-open-sans bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-8"
              onClick={() => {
                setPopup(true);
                setrejectId(id);
                setRecipe(recipeName);
              }}
            >
              Reject
            </button>
          </>
        ) : (
          <div className="w-48"></div>
        )}
      </div>
    </div>
  );

  return (
    <div className="App">
      <Header />
      <div className="items-center justify-center p-16">
        <ToastContainer />
        {isLoading ? (
          <div className="loader-container">
            <div className="loader">
              <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
            </div>
          </div>
        ) : (
          <>
            <PopupDialog
              isOpen={isPopupOpen}
              onClose={closePopup}
              onConfirm={(message) => {
                closePopup();
                handleRecipeAction(false, rejectId, curRecipe, message);
              }}
            />
            <div class="mx-40">
              <div>
                <h2 class="text-[30px] px-10 font-sans">Recipe Requests</h2>
              </div>
            </div>
            {recReq.map((req, index) => (
              <div
                className="py-4 flex items-center justify-center"
                key={index}
              >
                <RequestCard
                  id={req.id}
                  image={req.image}
                  culName={req.first_name}
                  recipeName={req.name}
                  cuisine={req.cuisine}
                  totalTime={req.total_time}
                  status={req.status}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeRequest;
