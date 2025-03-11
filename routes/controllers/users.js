import express from 'express';
import models from '../../models.js';

var router = express.Router();

app.get("/myIdentity", (req, res) => {
    if (!req.session.account) {
        res.json({ status: "loggedout" });
    } else {
        res.json({
            status: "loggedin",
            userInfo: {
                name: req.session.account.name,
                username: req.session.account.username,
            },
        });
    }
});