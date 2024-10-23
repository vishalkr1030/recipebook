import React from "react";
import Card from "./Card";
import NoRecipeFound from "./NoRecipeFound";

export default function RecipeContainer({ data }) {
  if (data === undefined || data.length === 0) return <NoRecipeFound />;

  return (
    <div className="flex flex-wrap justify-left gap-10 mx-10 p-12">
      {data.map((item, index) => (
        <Card
          key={index}
          foodName={item.name}
          timeTaken={`${item.total_time} mins`}
          imageUrl={item.image}
          id={item.id}
        />
      ))}
    </div>
  );
}
