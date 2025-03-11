import express from 'express';
import models from '../../models.js';

const Post = models.Post;
const Comment = models.Comment;
var router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.session.account) {
    return next();
  } else {
    return res.status(401).json({
      status: "error",
      error: "not logged in",
    });
  }
};

router.post('/', isAuthenticated, async (req, res) => {
  const { title, summary, ingredients, instructions } = req.body;
  const { username } = req.session.account || {};

  if (!title || !summary || !ingredients || !instructions) {
    return res.status(400).json({
      status: 'error',
      error: 'All fields are required',
    });
  }

  try {
    // Create a new Recipe post
    const newPost = new Post({
      title,
      summary,
      ingredients,
      instructions,
      username,  // Save the username in the post
    });

    await newPost.save();

    res.json({
      status: 'success',
      message: 'Recipe posted successfully',
    });
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

// GET /api/v3/recipes - Get all recipes or filter by username
router.get('/', async (req, res) => {
  const { username: queryUsername } = req.query;

  try {
    // Fetch recipes and apply username filter if necessary
    let recipesQuery = Post.find();

    if (queryUsername) {
      recipesQuery = recipesQuery.where('username').equals(queryUsername);
    }

    const recipes = await recipesQuery;

    // Map over the recipes and generate previews for URLs
    const recipeData = await Promise.all(
      recipes.map(async (recipe) => {
        try {
          return {
            id: recipe._id,
            title: recipe.title,
            summary: recipe.summary,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            username: recipe.username,
            created_date: recipe.created_date,          };
        } catch (error) {
          return {
            id: recipe._id,
            title: recipe.title,
            summary: recipe.summary,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            username: recipe.username,
            created_date: recipe.created_date,
          };
        }
      })
    );

    res.json(recipeData);
  } catch (error) {
    console.error('Error retrieving recipes:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

router.post('/like', isAuthenticated, async (req, res) => {
  const { username } = req.session.account || {};
  const { postID } = req.body;

  try {
    const recipe = await Post.findById(postID);

    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        error: 'Recipe not found',
      });
    }

    if (recipe.likes.includes(username)) {
      return res.json({
        status: 'success',
      });
    }

    recipe.likes.push(username);
    await recipe.save();

    res.json({
      status: 'success',
      message: 'Recipe liked successfully',
    });
  } catch (error) {
    console.error('Error liking recipe:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

router.post('/unlike', isAuthenticated, async (req, res) => {
  const { username } = req.session.account || {};
  const { postID } = req.body;

  try {
    const recipe = await Post.findById(postID);

    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        error: 'Recipe not found',
      });
    }

    if (!recipe.likes.includes(username)) {
      return res.json({
        status: 'success',
      });
    }

    recipe.likes = recipe.likes.filter(like => like !== username);
    await recipe.save();

    res.json({
      status: 'success',
      message: 'Recipe unliked successfully',
    });
  } catch (error) {
    console.error('Error unliking recipe:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

export default router;