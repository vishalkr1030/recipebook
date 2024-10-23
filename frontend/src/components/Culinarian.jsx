import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Header from "./Header";
import AcceptDeleteReq from "./AcceptDeleteRequests.jsx";
import { useNavigate } from "react-router-dom";
import nodata from "../assets/No_data.png";

function Culinarian() {
  const notify = (message) => toast(message);
  const navigate = useNavigate();
  const [culinaryData, setCulinaryData] = useState([]);
  const [updatedStatus, setStatus] = useState("");
  const [hasData, setHasData] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    axios
      .get(`http://localhost:1200/api/detail/culinarian`)
      .then((response) => {
        setCulinaryData(response.data.data);
        setHasData(response.data.count);
      })
      .catch((error) => {
        navigate("/dashboard");
        console.error(error);
      });
  }, [navigate]);

  function handleAccept() {
    setStatus("Accept");
    setShowModal(true);
  }
  function handleReject() {
    setStatus("Reject");
    setShowModal(true);
  }

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

  //To display requests
  const RequestCard = ({ name, id, user_id, specialization, bio, status }) => (
    <div
      className="flex justify-between items-center px-4 gap-4 py-4 min-h-40 lg:w-full bg-white hover:drop-shadow-2xl rounded-md text-darkslategray-100 md:w-5/6 sm:w-11/12"
      key={id}
    >
      <div className=" flex w-[60%] justify-between place-items-start px-2">
        <div className="w-[30%] flex flex-col justify-between items-center">
          <p className="text-[18px] font-bold text-gray-900">Name</p>
          <p className="text-[18px] font-bold text-gray-900 pt-2">{name}</p>
        </div>
        <div className="w-[30%] flex flex-col justify-between items-center">
          <p className="text-[18px] font-bold text-gray-900">Specialization</p>
          <p className="text-[18px] font-bold text-gray-900 pt-2">
            {Array.isArray(specialization) ? (
                specialization.map((Specialization, index) => (
                  <span key={index}>{Specialization}</span>
                ))
              ) : (
                <span>{specialization}</span>
              )}
          </p>
        </div>
        <div className="w-[30%] flex flex-col  justify-between items-center">
          <p className="text-[18px] font-bold text-gray-900">Bio</p>
          <p className="text-[18px] font-bold text-gray-900 pt-2">{bio}</p>
        </div>
        
      </div>

      <div
        className={`w-[20%] font-sans lg:flex lg:flex-row sm:flex-col md:flex-col justify-center items-center`}
      >
        <p
          className={`min-w-24 rounded min-h-8 text-center pt-2  ${getTagClass(
            status
          )}`}
        >
          {status}
        </p>
      </div>

      <div className="w-[10%] lg:flex lg:flex-row sm:flex-col md:flex-col justify-center items-center">
        {status === "Pending" ? (
          <>
            <button
              className="bg-primary-100 hover:bg-primary-300 text-white px-4 py-2 rounded-md mr-4"
              autocomplete="off"
              onClick={() => handleAccept(true, id)}
            >
              Accept
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-4"
              autocomplete="off"
              onClick={() => handleReject(id)}
            >
              Reject
            </button>
            {showModal && (
              <AcceptDeleteReq
                show={showModal}
                handleClose={handleCloseModal}
                status={updatedStatus}
                culId={id}
                user_id={user_id}
              />
            )}
          </>
        ) : (
          <div className=""></div>
        )}
      </div>

      <div className="w-[10%] lg:flex lg:flex-row sm:flex-col md:flex-col justify-center items-center">
        {status === "Accepted" ? (
          <>
            <button
              autocomplete="off"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-8"
              onClick={() => handleReject(id)}
            >
              Reject
            </button>
            {showModal && (
              <AcceptDeleteReq
                show={showModal}
                handleClose={handleCloseModal}
                status={updatedStatus}
                culId={id}
                user_id={user_id}
              />
            )}
          </>
        ) : (
          <div className=""></div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <ToastContainer />
      <div class="cul-body font-open-sans items-center justify-center p-16">
        <div class="cul-outer-container mx-40">
          <div>
            <h2 class="text-[30px] px-10">Culinarian's Requests</h2>
          </div>

          {hasData === true && (
            <>
              
              <div>
                {Array.isArray(culinaryData) ? (
                  culinaryData.map((data, index) => (
                    <div
                      className="py-4 flex items-center justify-center"
                      key={index}
                    >
                      <RequestCard
                        name={data.f_name + " " + data.l_name}
                        specialization={data.specialization}
                        bio={data.bio}
                        status={data.status}
                        id={data.id}
                        user_id={data.user_id}
                      />
                    </div>
                  ))
                ) : (
                  <p>No data available</p>
                )}
              </div>
            </>
          )}

          {hasData === false && (
            <div class="no-data w-full text-black flex flex-col justify-center items-center gap-5 py-10">
              <img src={nodata} alt="no-data"></img>
              <h2 class="no-data-h2 text-[30px]">Check Other Sections</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Culinarian;
