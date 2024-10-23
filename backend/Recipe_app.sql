create database Recipe_app;

-- //execute this inorder to work with uuid_generate_v4 datatype;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

Create table user_data(
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	first_name varchar(255),
	last_name varchar(255),
	email varchar(255),
	address varchar(255),
	gender varchar(10),
	dob DATE,
	role varchar(20),
	phone_number numeric(10),
	about varchar(255),
	password varchar(255)  
);
ALTER TABLE user_data ADD COLUMN dob DATE;

Create table Recipe(
	id UUID primary key default uuid_generate_v4(),
	Name varchar(255),
	Description text,
	Image varchar(255),
	Rating numeric(4,2),
	Ingredients varchar(255)[],
	instructions TEXT[],
	Preparation_time numeric(5),
	Cooking_time numeric(5),
	Total_time numeric(5),
	Servings varchar(10),
	Difficulty varchar(20),
	Cuisine varchar(20),
	Meal_type varchar(20),
	Status varchar(10),
	Course_type varchar(20),
	total_ratings numeric(5), 
	User_id UUID references user_data(id)		,
	Comment text DEFAULT NULL
);
select * from Recipe;

Create table Ingredients(
	ID UUID Primary key default uuid_generate_v4(),
	Ingredient_name varchar(100) UNIQUE,
	Category varchar(100)
);
INSERT INTO Ingredients (Ingredient_name, Category) VALUES
('Tomato', 'Vegetable'),('Pasta', 'Grain'),('Broccoli', 'Vegetable'),('Cheese', 'Dairy'),('Carrot', 'Vegetable'),
('Fish', 'Seafood'),('Egg', 'Dairy'),('Potato', 'Vegetable'),('Lettuce', 'Vegetable'),('Flour', 'Grains'),('Sugar', 'Sweeteners'),('Salt', 'Seasonings'),('Pepper', 'Seasonings'),
('Olive Oil', 'Oils'),('Chicken', 'Meat'),('Rice', 'Grains'),('Chicken Breast', 'Meat'),('Garlic', 'Vegetables'),('Milk', 'Dairy');
select * from Ingredients;

create table Cuisine_type(
	ID UUID primary key default uuid_generate_v4(),
	Name varchar(25),
	Description text
);
INSERT INTO Cuisine_type (Name, Description)
VALUES
    ('Italian', 'Italian cuisine is known for its regional diversity, abundance of pasta, pizza, and use of ingredients like tomatoes, olive oil, and garlic.'),
    ('Chinese', 'Chinese cuisine is diverse, with a wide range of cooking styles and flavors influenced by regions such as Sichuan, Cantonese, and Hunan.'),
    ('Spanish', 'Spanish cuisine is characterized by its Mediterranean influence, including dishes like paella, tapas, and a variety of seafood.'),
    ('Thai', 'Thai cuisine features bold flavors, aromatic herbs, and spices, with dishes like pad Thai, green curry, and tom yum soup.'),
    ('Indian', 'Indian cuisine is known for its rich flavors, diverse spices, and wide variety of vegetarian and non-vegetarian dishes, including curries, biryanis, and tandoori.'),
    ('American', 'American cuisine encompasses a wide range of regional dishes and influences, including burgers, barbecue, Tex-Mex, and soul food.'),
    ('Asian', 'Asian cuisine is a broad category that includes diverse culinary traditions from countries like China, Japan, Korea, Thailand, and Vietnam, known for their unique flavors and ingredients.'),
    ('Japanese', 'Japanese cuisine is characterized by its emphasis on fresh, seasonal ingredients, simplicity, and precision, with dishes like sushi, tempura, and ramen.');
select * from Cuisine_type;

Create table Favorites(
	ID UUID primary key default uuid_generate_v4(),
	User_ID UUID references user_data(id),
	Recipe_id UUID references Recipe(id),
	Date_added timestamp,
	Notes text
);
select * from Favorites;


create table Culinarian(
	ID UUID primary key default uuid_generate_v4(),
	User_ID UUID references user_data(id),
	RequestDate timestamp default CURRENT_DATE,
	Specialization varchar(255)[],
	Bio text, 
	Status varchar(255) DEFAULT Pending,
);

select * from Culinarian;


create table Ratings(
	ID UUID primary key default uuid_generate_v4(),
	User_ID UUID references user_data(id),
	Recipe_id UUID references recipe(id),
	Rating numeric(2)
);

select * from Ratings;


CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    recipe_id UUID,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_data(id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id)
);
select * from notifications;

