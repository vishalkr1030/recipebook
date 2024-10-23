import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";
const ChangePasswordModal = ({ handleClose }) => {
  const notify = (message) => toast(message);
  const userId = Cookies.get("user_id");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verify, setVerify] = useState(false);
  const handleChange1 = (event) => setOldPassword(event.target.value);
  const handleChange2 = (event) => setNewPassword(event.target.value);
  const handleChange3 = (event) => setConfirmPassword(event.target.value);
  const getPasswordStrength = (newPassword) => {
    const hasCapitalLetter = /[A-Z]/.test(newPassword);
    const hasSmallLetter = /[a-z]/.test(newPassword);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const hasMinimumLength = newPassword.length >= 8;
    if (newPassword.length === 0) {
      return "Please enter a password";
    }
    if (newPassword.length === 1) {
      return "Very Weak";
    }
    if (
      hasCapitalLetter &&
      hasSmallLetter &&
      hasSpecialCharacter &&
      hasMinimumLength
    ) {
      return "Very Strong";
    }
    if (hasCapitalLetter && hasSmallLetter && hasMinimumLength) {
      return "Strong";
    }
    if ((hasCapitalLetter || hasSmallLetter) && hasMinimumLength) {
      return "Medium";
    }
    return "Weak";
  };
  const passwordStrength = getPasswordStrength(newPassword);
    const handleChangePassword = () => {
    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      notify("Fields Empty !!");
    } else if (newPassword !== confirmPassword) {
      notify("Password Mismatch");
    } else {
      axios
        .get(
          `http://localhost:1200/api/detail/Password/${oldPassword}/${userId}`
        )
        .then((response) => {
          setVerify(response.data.msg);
          if (!response.data.msg) {
            notify("Wrong Old Password");
          } else {
            if (verify === true && newPassword === confirmPassword) {
              axios
                .put(
                  `http://localhost:1200/api/detail/changePassword/${newPassword}/${userId}`
                )
                .then((response) => {
                  notify("Password Changed Successfully");
                  handleClose();
                })
                .catch((error) => {
                  notify("Error changing password");
                });
            }
          }
        })
        .catch((error) => {
          notify("Error verifying old password");
        });
    }
  };

  const cancelDelete = () => {
    handleClose();
  };

  return (
    <div>
      <div
        className="relative z-10 font-open-sans"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto font-open-sans">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left flex flex-col w-full">
                    <form>
                      <h3
                        className="text-[25px] font-semibold leading-6 text-gray-900 "
                        id="modal-title"
                      >
                        Change Password
                      </h3>

                      <div className="password-container flex flex-col justify-start my-2 w-full space-y-4 ">
                        <div className="py-0.5">
                          <span className="mb-2 text-md">Old Password:</span>
                          <input
                            type="password"
                            id="old-password"
                            name="old_password"
                            required
                            className="block mt-1 w-full bg-textbg rounded-md box-border border-0 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={handleChange1}
                          />
                        </div>
                        <div className="py-0.5">
                          <span className="mb-2 text-md">New Password</span>
                          <input
                            type="password"
                            id="new-password"
                            name="new_password"
                            required
                            className="block mt-1 w-full bg-textbg rounded-md box-border border-0 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={handleChange2}
                          />
                                <div className="mt-2 flex justify-between">
                  <div className="flex-1 mr-2">
                    <div
                      className={`h-2 rounded ${
                        passwordStrength === "Very Weak"
                          ? "bg-red-400"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 mr-2">
                    <div
                      className={`h-2 rounded ${
                        passwordStrength === "Weak"
                          ? "bg-orange-400"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 mr-2">
                    <div
                      className={`h-2 rounded ${
                        passwordStrength === "Medium"
                          ? "bg-yellow-400"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 mr-2">
                    <div
                      className={`h-2 rounded ${
                        passwordStrength === "Strong"
                          ? "bg-green-400"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <div
                      className={`h-2 rounded ${
                        passwordStrength === "Very Strong"
                          ? "bg-blue-400"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
                        <div className="py-0.5">
                          <span className="mb-2 text-md">
                            Confirm New Password
                          </span>
                          <input
                            type="password"
                            id="confirm-password"
                            name="confirm_password"
                            required
                            className="block mt-1 w-full bg-textbg rounded-md box-border border-0 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={handleChange3}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse justify-center items-center sm:px-6 ">
                <button
                  type="button"
                  className=" w-full rounded-md bg-primary-100 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto font-open-sans cursor-pointer"
                  onClick={handleChangePassword}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="mt-3 w-full rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 font-open-sans hover:bg-gray-500 sm:mt-0 sm:w-auto"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChangePasswordModal;
