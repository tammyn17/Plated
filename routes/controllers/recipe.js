import express from "express";

var router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const post = req.models.Post({
      title: req.body.title,
      summary: req.body.summary,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      created_date: new Date(),
    });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.get("/", async (req, res, next) => {
  try {
    const posts = await req.models.Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

export default router;
