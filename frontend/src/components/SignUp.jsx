import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Limage from "../assets/signup.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const Navigate = useNavigate();
  const notify = (message) => toast(message);

  const FormSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - selectedDate.getFullYear();
    const monthDifference = today.getMonth() - selectedDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < selectedDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      notify("You must be at least 18 years old");
    } else {
      try {
        const body = {
          firstname,
          lastname,
          email,
          address,
          gender,
          dob,
          phonenumber,
          password,
          repassword,
        };
        const response = await fetch("http://localhost:1200/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 401) {
          const errorMessage = await response.text();
          notify(errorMessage);
        } else {
          notify("Successfully Registered");
          setTimeout(() => {
            Navigate("/");
          }, 500);
        }
      } catch (err) {
        console.log(err.message);
      }

      setFirstname("");
      setLastname("");
      setEmail("");
      setGender("");
      setPassword("");
      setrePassword("");
      setPhone("");
      setAddress("");
    }
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };
  const getPasswordStrength = (password) => {
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasSmallLetter = /[a-z]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinimumLength = password.length >= 8;
    if (password.length === 0) {
      return "Please enter a password";
    }
    if (password.length === 1) {
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
  const passwordStrength = getPasswordStrength(password);

  return (
    <div
      style={{
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="bg-textbg"
    >
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen bg-grey-100">
        <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl  rounded-2xl md:flex-row md:space-y-0">
          <div className="flex flex-col justify-center md:px-14 md:py-8 p-10">
            <span className="mb-2 text-5xl text-center font-bold">Sign Up</span>
            <form onSubmit={FormSubmit} method="POST">
              <div className="mt-3">
                <span className="mb-2 rext-md">First Name</span>
                <input
                  type="text"
                  className="block w-full mt-1.5 rounded-md  box-border border-0 px-0 text-gray-900 shadow-sm ring-1 ring-inset bg-textbg ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="firstName"
                  id="FirstName"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="mt-3">
                <span className="mb-2 rext-md">Last Name</span>
                <input
                  type="text"
                  className="block w-full mt-1.5 rounded-md box-border border-0 px-0 text-gray-900 shadow-sm ring-1 ring-inset bg-textbg ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="lastname"
                  id="LastName"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
              <div className="mt-3">
                <span className="mb-2 rext-md">Email</span>
                <input
                  type="email"
                  className="block w-full mt-1.5 rounded-md box-border border-0 px-0 text-gray-900 shadow-sm ring-1 ring-inset  bg-textbg ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-3">
                <span className="mb-2 rext-md">Phone</span>
                <input
                  type="tel"
                  className="block w-full mt-1.5 rounded-md box-border border-0 px-0 text-gray-900 shadow-sm ring-1 ring-inset bg-textbg ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="phone"
                  id="phone"
                  value={phonenumber}
                  onChange={(e) => setPhone(e.target.value)}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              <div className="mt-3">
                <span className="mb-2 rext-md">Gender</span>
                <div className="flex items-center">
                  <label className="inline-flex items-center mt-1.5">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out box-border border-0 shadow-sm ring-1 ring-inset  bg-textbg ring-gray-300"
                    />
                    <span className="ml-2">Male</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out box-border border-0 shadow-sm ring-1 ring-inset bg-textbg ring-gray-300"
                    />
                    <span className="ml-2">Female</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="gender"
                      value="Others"
                      checked={gender === "Others"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out box-border border-0 shadow-sm ring-1 ring-inset  bg-textbg ring-gray-300"
                    />
                    <span className="ml-2">Others</span>
                  </label>
                </div>
              </div>
              <div className="mt-3">
                <span className="mb-2 text-md">Date of Birth</span>
                <input
                  type="date"
                  className="block w-full mt-1.5 rounded-md box-border border-0 px-0 text-gray-900 shadow-sm bg-textbg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 pr-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="dob"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
              <div className="max-w-sm mx-auto mt-3">
                <span className="mb-2 rext-md">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={handleChange}
                  className="block w-full mt-1.5 rounded-md box-border border-0 px-0 text-gray-900 shadow-sm ring-1 ring-inset  bg-textbg ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 pr-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
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
              <div className="mt-3">
                <span className="mb-2 rext-md">Confirm Password</span>
                <input
                  type="password"
                  className="block w-full mt-1.5 rounded-md box-border border-0 px-0 text-gray-900 shadow-sm bg-textbg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="repassword"
                  id="repassword"
                  value={repassword}
                  onChange={(e) => setrePassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-3">
                <span className="mb-2 text-md">Address</span>
                <textarea
                  type="text"
                  className="block w-full mt-1.5 rounded-md box-border border-0 px-0 text-gray-900 shadow-sm bg-textbg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:pr-8 focus:ring-2 pl-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name="address"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <button
                className="w-full lg:w-auto bg-primary-100 text-white px-40 py-2 rounded-lg mb-2 
        hover:border-gray-300 mt-4 "
              >
                Sign Up
              </button>
            </form>
            <div className="text-center text-grey-400">
              Do you have an account?
              <Link to="/" className="font-bold">
                Sign In
              </Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <img
              src={Limage}
              alt="Image"
              className="w-[600px] h-[800px] rounded-r-2xl md:block mr-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
