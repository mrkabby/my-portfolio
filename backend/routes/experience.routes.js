import { Router } from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = Router();
const EXPERIENCES_COLLECTION = db.collection("experiences");

// Endpoint for getting list of experiences
router.get('/', async (req, res) => {
    try {
        let results = await EXPERIENCES_COLLECTION.find({}).toArray();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for getting a single experience by id
router.get('/:id', async (req, res) => {
    try {
        let query = { _id: new ObjectId(req.params.id) };
        let result = await EXPERIENCES_COLLECTION.findOne(query);
        if (!result) {
            res.status(404).json({ message: "Experience Not Found" });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for adding a single experience
router.post("/", async (req, res) => {
    try {
        let newExperience = req.body;
        let result = await EXPERIENCES_COLLECTION.insertOne(newExperience);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for updating an experience by the Id
router.patch('/:id', async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = { $set: req.body };
        let result = await EXPERIENCES_COLLECTION.updateOne(query, updates);
        if (result.modifiedCount === 0) {
            res.status(404).json({ message: "Experience Not Found" });
        } else {
            res.status(200).json({ message: "Experience Updated Successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for deleting an experience by id
router.delete('/:id', async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        let result = await EXPERIENCES_COLLECTION.deleteOne(query);
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Experience Not Found" });
        } else {
            res.status(200).json({ message: "Experience Deleted Successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
