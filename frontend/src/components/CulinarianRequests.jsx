import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function CulinarianRequests({show}) {
    const notify = (message) => toast(message);
    const [selectedSpecializations, setSelectedSpecializations] = useState([]);
    const [bio,setbio] = useState("");
    const navigate = useNavigate();
    const [username,setusername] = useState("");
    const handleChange = (event) => {
      const { value, checked } = event.target;
      if (checked) {
        setSelectedSpecializations([...selectedSpecializations, value]);
      } else {
        setSelectedSpecializations(selectedSpecializations.filter((item) => item !== value));
      }
    };
    const handleSubmit = async (e) => {
        const user_id = Cookies.get("user_id");
        e.preventDefault();
        try {
            const body = {
              user_id,
              selectedSpecializations,
              bio
            };
          
            const response = await fetch("http://localhost:1200/api/culinarian", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (data) {
                axios.get("http://localhost:1200/notify/notification")
                .then(response=>
                  { 
                    const body = {
                      user_id : response.data,
                      reason  :data + " Requested to be a culinarian"
                   }
                    axios.post("http://localhost:1200/notify/notification",body)
                    .then(response=>
                      {
                      })
                     .catch(error=>
                      {
                      })
                  })
                  .catch(error => {
                  })
                notify("Request as sent to Admin")
                setTimeout(()=>{
                  window.location.reload();
                },1000)
            } else {
                    notify("it is under evalution");
            }
        } catch (error) {
            console.error('Error:', error.message);
            notify("An error occurred while processing your request");
        }
    };
    
    const handleclose = ()=>{
        window.location.reload();
    };
  
  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <div>
        <div
          class="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white px-4 pb-2 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mt-1 sm:mt-0 sm:text-left flex flex-col">
                      <h3
                        class="text-[18px] font-semibold leading-2 text-gray-900 mb-1"
                        id="modal-title"
                      >
                        Your Specialisation
                      </h3>

                      <div className="password-container flex flex-col w-[470px] my-2 ">
                        <div className="specialization-form">
                          <div className="options">
                            <div className="option">
                              <input
                                type="checkbox"
                                id="north-indian"
                                name="specialization"
                                value="North Indian"
                                onChange={handleChange}
                                className="ring-1 ring-inset ring-gray-300 mr-2"
                                checked={selectedSpecializations.includes(
                                  "North Indian"
                                )}
                              />
                              <label
                                htmlFor="north-indian"
                                className="option-label"
                              >
                                North Indian
                              </label>
                            </div>
                            <div className="option">
                              <input
                                type="checkbox"
                                id="continental"
                                name="specialization"
                                value="Continental"
                                onChange={handleChange}
                                className="ring-1 ring-inset ring-gray-300 mr-2"
                                checked={selectedSpecializations.includes(
                                  "Continental"
                                )}
                              />
                              <label
                                htmlFor="continental"
                                className="option-label"
                              >
                                Continental
                              </label>
                            </div>
                            <div className="option">
                              <input
                                type="checkbox"
                                id="chinese"
                                name="specialization"
                                value="Chinese"
                                onChange={handleChange}
                                className="ring-1 ring-inset ring-gray-300 mr-2"
                                checked={selectedSpecializations.includes(
                                  "Chinese"
                                )}
                              />
                              <label htmlFor="chinese" className="option-label">
                                Chinese
                              </label>
                            </div>
                            <div className="option">
                              <input
                                type="checkbox"
                                id="japanese"
                                name="specialization"
                                value="Japanese"
                                className="ring-1 ring-inset ring-gray-300 mr-2"
                                onChange={handleChange}
                                checked={selectedSpecializations.includes(
                                  "Japanese"
                                )}
                              />
                              <label
                                htmlFor="japanese"
                                className="option-label"
                              >
                                Japanese
                              </label>
                            </div>
                            <div className="option">
                              <input
                                type="checkbox"
                                id="italian"
                                name="specialization"
                                value="Italian"
                                onChange={handleChange}
                                className="ring-1 ring-inset ring-gray-300 mr-2"
                                checked={selectedSpecializations.includes(
                                  "Italian"
                                )}
                              />
                              <label htmlFor="italian" className="option-label">
                                Italian
                              </label>
                            </div>
                          </div>
                        </div>
                        <textarea
                          type="text"
                          id="new-password"
                          name="new_password"
                          placeholder="About You"
                          required
                          className="block w-full rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                          value={bio}
                          onChange={(e) => setbio(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse justify-center items-center sm:px-6">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-primary-100 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto font-open-sans cursor-pointer"
                  >
                    Submit
                  </button>

                  <button
                    type="button"
                    className="mt-3 w-full rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 font-open-sans hover:bg-gray-500 sm:mt-0 sm:w-auto"
                    onClick={handleclose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
