import express from "express";
var router = express.Router();

import recipeRouter from "./controllers/recipe.js";
import commentRouter from "./controllers/comments.js";
import userRouter from "./user.js";

router.use("/recipe", recipeRouter);
router.use("/comments", commentRouter);
router.use("/user", userRouter);

export default router;
