import express from 'express';
import models from '../../models.js';

const Comment = models.Comment;
const router = express.Router();

router.get('/', async (req, res) => {
    const { postID } = req.query;

    if (!postID) {
        return res.status(400).json({
            status: 'error',
            error: 'postID is required',
        });
    }

    try {
        const comments = await Comment.find({ post: postID });

        res.json(comments);
    } catch (error) {
        console.error('Error retrieving comments:', error);
        res.status(500).json({
            status: 'error',
            error: error.message,
        });
    }
});

router.post('/', async (req, res) => {
    const { username } = req.session.account || {};
    const { postID, newComment } = req.body;

    if (!username) {
        return res.status(401).json({
            status: 'error',
            error: 'not logged in',
        });
    }

    if (!postID || !newComment) {
        return res.status(400).json({
            status: 'error',
            error: 'postID and newComment are required fields',
        });
    }

    try {
        const comment = new Comment({
            username,
            comment: newComment,
            post: postID,
            created_date: new Date(),
        });

        await comment.save();

        res.json({
            status: 'success',
        });
    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(500).json({
            status: 'error',
            error: error.message,
        });
    }
});

export default router;