import express from "express";

var router = express.Router();

router.post("/", async (req, res, next) => {
  if (req.session.isAuthenticated) {
    try {
      const post = req.models.Post({
        title: req.body.title,
        summary: req.body.summary,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        created_date: new Date(),
        user: req.session.account.username,
        likes: []
      });
      await post.save();
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  else {
    return res.status(401).json({ status: "error", error: "not logged in" });
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

router.post("/like", async function (req, res, next) {  
  if (req.session.isAuthenticated) {
      try {
          const username = req.session.account.username;
          const post = await req.models.Post.findById(req.body.postID);

          if (!post.likes.includes(username)) {
              post.likes.push(username);
              await post.save();
              res.json({ status: "success" });
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({ status: "error", error: error.message });
      }
  } else {
      return res.status(401).json({ status: "error", error: "not logged in" });
  }
})

router.post("/unlike", async function (req, res, next) {
  if (req.session.isAuthenticated) {
      try {
          const username = req.session.account.username;
          const post = await req.models.Post.findById(req.body.postID);

          if (post.likes.includes(username)) {
              post.likes = post.likes.filter((like) => like !== username);
              await post.save();
              res.json({ status: "success" });
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({ status: "error", error: error.message });
      }
  } else {    
      return res.status(401).json({ status: "error", error: "not logged in" });
  }
})

router.delete("/", async function (req, res) {
  if (req.session.isAuthenticated) {
      try {
          const post = await req.models.Post.findById(req.body.postID);

          if (post.username !== req.session.account.username) {
              return res.status(401).json({ status: "error", error: "you can only delete your own posts" });
          }

          await req.models.Comment.deleteMany({ post: req.body.postID });
          await req.models.Post.deleteOne({ _id: req.body.postID });
          res.json({ status: "success" });
      } catch (error) {
          console.error(error);
          res.status(500).json({ status: "error", error: error.message });
      }
  } else {
      return res.status(401).json({ status: "error", error: "not logged in" });
  }
})

export default router;
