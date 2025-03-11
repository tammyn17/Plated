import express from "express";

var router = express.Router();


router.get("/", async (req, res, next) => { 
    try  {
        const comments = await req.models.Comment.find({ post: req.query.postID });
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: error.message });
    } 
})

router.post("/", async (req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            const newComment = new req.models.Comment({
                username: req.session.account.username,
                comment: req.body.newComment,
                post: req.body.postID,
                created_date: new Date()
            });

            await newComment.save();
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