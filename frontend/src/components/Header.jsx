import { memo, useState } from "react";
import hatimage from "../assets/hat.png";
import user from "../assets/Vector (1).png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBell } from "react-icons/fa";
import Notification from "./Notification";

const Header = memo(() => {
  const navigator = useNavigate();
  const userId = Cookies.get("user_id");
  const userRole = Cookies.get("role");
  const [notificationVisible, setNotificationVisible] = useState(false);

  function handleProfileclick() {
    navigator("/user");
  }
  function handleFavClick() {
    navigator(`/api/${userId}/saved-recipes`);
  }
  function handleHomeClick() {
    navigator("/dashboard");
  }
  function handleReqClick() {
    navigator("/culinarianReq");
  }

  function handleRecipeReqClick() {
    navigator("/recipe-request");
  }

  const notify = (message) => toast(message);
  function handleLogout() {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user_id");
    notify("Logout Successfully");
    setTimeout(() => {
      navigator("/");
    }, 500);
  }
  function handleMyRecipes() {
    navigator("/my-recipes");
  }
  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
  };

  return (
    <header className="self-stretch h-[99px] bg-white overflow-hidden shrink-0 flex flex-row items-center justify-between py-[22px] pr-[95px] pl-[43px] box-border gap-[20px] top-[0] z-[99] sticky max-w-full text-left text-21xl text-darkslategray-100 font-mystery-quest mq450:pr-5 mq450:box-border mq750:pl-[21px] mq750:pr-[47px] mq750:box-border">
      <div className="self-stretch w-[269px] flex flex-row items-start justify-end gap-[9px]">
        <div className="flex flex-col items-start justify-start pt-1.5 px-0 pb-0">
          <img
            className="w-9 h-9 relative object-cover z-[1]"
            loading="eager"
            alt=""
            src={hatimage}
          />
        </div>
        <h2 className="m-0 self-stretch flex-1 relative text-inherit tracking-[0.06em] font-normal font-inherit z-[1]">
          Cook buddy
        </h2>
      </div>
      <div className="w-[550px] flex flex-col items-start justify-start pt-[5px] px-0 pb-0 box-border max-w-full text-5xl font-open-sans mq1050:w-0">
        <div className="self-stretch flex flex-row items-start justify-end mq1050:hidden">
          <div
            onClick={handleHomeClick}
            className="flex flex-col items-start justify-start py-0 pr-[4px] pl-0"
          >
            <b className="cursor-pointer h-[30px] relative tracking-[0.03em] inline-block shrink-0 z-[1] mr-6 ml-6 pr-6">
              Home
            </b>
          </div>
          {(userRole === "Admin" || userRole === "admin") && (
            <div className="shrink-0 z-[1] mr-6 ml-6 pr-6">
              <select
                value="hi"
                className="cursor-pointer h-10 focus:w-[250px] text-5xl pt-1 font-bold mq1050:w-0 w-44 rounded-md focus:border-none flex flex-col justify-center font-open-sans border-none outline-none"
                onChange={(e) => {
                  if (e.target.value === "culRequest") {
                    handleReqClick();
                  } else {
                    handleRecipeReqClick();
                  }
                }}
              >
                <option hidden value="requests">
                  Requests
                </option>
                <option value="culRequest">Culinarian Requests</option>
                <option value="recRequest">Recipe Requests</option>
              </select>
            </div>
          )}
          {(userRole === "admin" ||
            userRole === "Admin" ||
            userRole === "culinarian") && (
            <div
              onClick={handleMyRecipes}
              className="flex flex-col items-start justify-start"
            >
              <b
                className="cursor-pointer h-[30px] relative tracking-[0.03em] inline-block shrink-0 z-[1] ml-6 mr-6 pr-6"
                style={{ whiteSpace: "nowrap" }}
              >
                My Recipes
              </b>
            </div>
          )}
          <div
            onClick={handleFavClick}
            className="flex-[0.8226] flex flex-col items-start justify-start py-0 pr-[4px] pl-0"
          >
            <b className="cursor-pointer h-[30px] relative tracking-[0.03em] inline-block shrink-0 z-[1] ml-6 mr-6 pr-6">
              Favorites
            </b>
          </div>

          <div
            onClick={handleLogout}
            className="flex-[0.8226] flex flex-col items-start justify-start py-0 pr-[4px] pl-0"
          >
            <b className="cursor-pointer h-[30px] relative tracking-[0.03em] inline-block shrink-0 z-[1] ml-6 mr-6 pr-6">
              Logout
            </b>
            <ToastContainer className="text-lgi" />
          </div>
          <div className="flex items-center justify-center">
            <div
              className="cursor-pointer h-8 w-8 relative mr-8 flex items-center justify-center text-primary-300 bg-none  hover:cursor-pointer"
              onClick={toggleNotification}
            >
              <FaBell />
            </div>
            {notificationVisible && (
              <div className="absolute top-0 right-12 bg-primary-300 p-2 rounded-lg shadow-md">
                <Notification />
              </div>
            )}
          </div>

          <img
            className="cursor-pointer h-9 w-10 relative min-h-[36px] "
            loading="eager"
            alt=""
            src={user}
            onClick={handleProfileclick}
          />
        </div>
      </div>
    </header>
  );
});

export default Header;
