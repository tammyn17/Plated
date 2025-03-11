import express from "express";

var router = express.Router();

router.get("/status", async (req, res, next) => {
    res.json({
        isAuthenticated: req.session.isAuthenticated,
        user: req.session.isAuthenticated ? req.session.account.username : null
    })
})

export default router;