import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
const AcceptDeleteReq = ({ handleClose, status, culId, user_id }) => {
  const notify = (message) => toast(message);
  const [feedbackText, setFeedbackText] = useState("");
  const handleChange = (event) => {
    setFeedbackText(event.target.value.trim());
  };
  function handleAccept() {
    const updatedStatus = "Accepted";
    axios
      .put(
        `http://localhost:1200/api/detail/culinarian/${updatedStatus}/${culId}`
      )
      .then(() => {
        notify("Request Accepted! Status Updated");
        handleClose();
      })
      .catch((error) => {
        notify(error);
        handleClose();
      });
    const body = {
      user_id,
      reason: " you are accepted to be a culinarian",
    };
    axios
      .post(`http://localhost:1200/notify/notification`, body)
      .then((response) => {
      });
  }
  function handleReject() {
    const updatedStatus = "Rejected";
    axios
      .put(
        `http://localhost:1200/api/detail/culinarian/${updatedStatus}/${culId}`
      )
      .then(() => {
        notify("Request Rejected! Status Updated");
        handleClose();
      })
      .catch((error) => {
        notify(error);
        handleClose();
      });
    const reason =
      "your culinarian request has been rejected because " + feedbackText;
    const body = {
      user_id,
      reason,
    };
    axios
      .post(`http://localhost:1200/notify/notification`, body)
      .then((response) => {
        handleClose();
      })
      .catch((error) => {
        handleClose();
      });
  }
  const cancel = () => {
    handleClose();
  };
  return (
    <>
      <ToastContainer />
      <div>
        <div
          className="relative z-10 font-open-sans"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              {status === "Accept" && (
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left flex flex-col w-full">
                        <span className="text-[20px]">
                          Are you sure you want to Accept this user as a
                          culinarian
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse justify-center items-center sm:px-6">
                    <button
                      type="button"
                      className=" w-full rounded-md bg-primary-100 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                      onClick={() => handleAccept()}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                      onClick={cancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {status === "Reject" && (
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left flex flex-col w-full">
                        <span className="text-[20px]">
                          Are you sure you want to Reject this user as a
                          culinarian
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className=" my-3 text-center sm:mt-0 sm:text-left flex flex-col w-full">
                        <label className="mb-3 font-bold text-xl">
                          Rejection Message
                        </label>
                        <textarea
                          id="admin-feedback"
                          name="adminFeedback"
                          rows="4"
                          className="resize-none rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-textbg"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse justify-center items-center sm:px-6">
                    <button
                      type="button"
                      className=" w-full rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                      onClick={() => handleReject()}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                      onClick={cancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcceptDeleteReq;
