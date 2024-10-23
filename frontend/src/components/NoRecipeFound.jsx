import React from 'react';
import noRecipe from '../assets/no-recipe-found.png';
const NoRecipeFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full ">
    <img src={noRecipe} alt="No Recipe Found" className="m-6 h-60 w-100" /> 
    </div>
  );
};

export default NoRecipeFound;
