# Plated
https://plated.onrender.com/
# API Endpoints
POST /user Authenticate a user and create a
session.

POST /recipe Upload a new recipe.

GET /recipe feed Retrieve all publicly shared recipes.

POST /comment Post a comment under a recipe 

GET /comment Retrieve comments under recipes
POST /recipe/like Like a recipe 

# User Stories
P0- As a user, I want to create an account and log in/out.

Authenticate users using Azure Authentication and store user profiles in MongoDB.

P0 - As a user, I want to create and upload my own recipes.

Implement a form to submit a recipe with a title, summary, and instructions, storing it in MongoDB.

P1 - As a user, I want to view a public feed of all uploaded recipes.

Retrieve and display recipes from the database in a shared feed.

P2 - As a user, I want to like and comment on my favorite recipes.

Store Like and Comments in the database under the recipie’s post.
