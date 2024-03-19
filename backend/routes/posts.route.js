import { Router } from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import multer from "multer";

const router = Router();
const POSTS_COLLECTION = db.collection("posts");

// Set up Multer for handling image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
    // Implement your authentication logic here
    // For example, check if the user is logged in and has admin privileges
    const isAdmin = req.user && req.user.isAdmin;
    if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};

// Route for creating a new post (admin access required)
router.post('/posts', authenticateAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Get the path of the uploaded image
        const newPost = { title, content, imageUrl };
        const result = await POSTS_COLLECTION.insertOne(newPost);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route for updating an existing post (admin access required)
router.patch('/posts/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Get the path of the uploaded image
        const updates = { $set: { title, content, imageUrl } };
        const result = await POSTS_COLLECTION.updateOne({ _id: new ObjectId(postId) }, updates);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Post Not Found" });
        }
        res.status(200).json({ message: "Post Updated Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route for deleting a post by id (admin access required)
router.delete('/posts/:id', authenticateAdmin, async (req, res) => {
    try {
        const postId = req.params.id;
        const result = await POSTS_COLLECTION.deleteOne({ _id: new ObjectId(postId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Post Not Found" });
        }
        res.status(200).json({ message: "Post Deleted Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
