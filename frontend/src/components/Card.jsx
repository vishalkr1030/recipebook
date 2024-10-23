import React from "react";
import { Link } from "react-router-dom";
const Card = ({ foodName, timeTaken, imageUrl, id }) => {
  return (
    <Link className="no-underline" to={`/user/detail-recipe/${id}`}>
      <div className="w-72 h-50 bg-primary-100 hover:drop-shadow-2xl rounded-lg overflow-hidden flex flex-col mr-4">
        <img
          src={imageUrl}
          alt={foodName}
          className="w-full h-32 object-cover"
        />
        <div
          className="p-4 flex flex-col justify-between"
          style={{ paddingTop: "5px" }}
        >
          <h3
            className="text-base text-white font-open-sans mb-1 line-clamp-1"
            style={{ letterSpacing: "0.05em", marginLeft: "-5px" }}
          >
            {foodName}
          </h3>
          <p
            className="text-xs text-white font-open-sans mb-1"
            style={{ letterSpacing: "0.03em", marginLeft: "-5px" }}
          >
            Total Time: {timeTaken}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
