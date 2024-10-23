import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const Notification = () => {
  const [visible, setVisible] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const id = Cookies.get("user_id");
    axios
      .get(`http://localhost:1200/notify/notification1?user_id=${id}`)
      .then((response) => {
        const notificationsData = response.data;
        setNotifications(notificationsData);
      })
      .catch((error) => {
        console.error("Error fetching notification data:", error);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      {visible && (
        <div
          className="fixed top-[120px] right-0 z-[1000] bg-white p-2 rounded-md shadow-md"
          style={{
            width: "250px",
            maxHeight: "500px",
            overflowY: "auto",
            marginRight: "200px",
          }}
        >
          {notifications.map((notification, index) => (
            <div key={index} className="flex flex-col mb-3 mr-6 mt-1">
              <div className="text-center justify-center text-xs text-gray-500 mb-2">
                {formatDate(notification.created_at)}
              </div>
              <div className="flex float-start ml-2">
                {notification.role === "admin" && (
                  <div className="bg-gray-200 rounded-lg p-0 text-xs md:p-2 md:text-sm font-open-sans">
                    <b>{notification.reason.split(" ")[0]}</b>{" "}
                    {notification.reason.split(" ").slice(1).join(" ")}
                  </div>
                )}
                {notification.role != "admin" && (
                  <div className="bg-gray-200 rounded-lg p-0 text-xs md:p-2 md:text-sm font-open-san">
                    {notification.first_name && (
                      <b>{notification.first_name}</b>
                    )}
                    {notification.reason && ` ${notification.reason}`}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Notification;
