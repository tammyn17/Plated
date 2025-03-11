import express from "express";
var router = express.Router();

import recipeRouter from "./controllers/recipe.js";
import usersRouter from './controllers/users.js';
import commentsRouter from './controllers/comments.js';

router.use("/recipe", recipeRouter);
router.use('/users', usersRouter);
router.use('/comments', commentsRouter);

export default router;
