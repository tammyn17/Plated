import express from "express";
var router = express.Router();

import recipeRouter from "./controllers/recipe.js";

router.use("/recipe", recipeRouter);

export default router;
