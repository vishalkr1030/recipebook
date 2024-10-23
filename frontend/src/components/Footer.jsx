import React from "react";
const Footer = () => {
  return (
    <footer className="bg-primary-100 text-gray-300 p-4 text-center font-open-sans ">
      <div className="container mx-auto">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Cook Buddy. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Made with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>{" "}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
