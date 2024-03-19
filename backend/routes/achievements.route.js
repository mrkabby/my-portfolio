import { Router } from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = Router();
const ACHIEVEMENTS_COLLECTION = db.collection("achievements");

// Endpoint for getting list of achievements
router.get('/', async (req, res) => {
    try {
        let results = await ACHIEVEMENTS_COLLECTION.find({}).toArray();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for getting a single achievement by id
router.get('/:id', async (req, res) => {
    try {
        let query = { _id: new ObjectId(req.params.id) };
        let result = await ACHIEVEMENTS_COLLECTION.findOne(query);
        if (!result) {
            res.status(404).json({ message: "Achievement Not Found" });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for adding a single achievement
router.post("/", async (req, res) => {
    try {
        let newAchievement = req.body;
        let result = await ACHIEVEMENTS_COLLECTION.insertOne(newAchievement);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for updating an achievement by the Id
router.patch('/:id', async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = { $set: req.body };
        let result = await ACHIEVEMENTS_COLLECTION.updateOne(query, updates);
        if (result.modifiedCount === 0) {
            res.status(404).json({ message: "Achievement Not Found" });
        } else {
            res.status(200).json({ message: "Achievement Updated Successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for deleting an achievement by id
router.delete('/:id', async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        let result = await ACHIEVEMENTS_COLLECTION.deleteOne(query);
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Achievement Not Found" });
        } else {
            res.status(200).json({ message: "Achievement Deleted Successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for deleting all projects
router.delete('/', async(req, res) => {
    let result = await ACHIEVEMENTS_COLLECTION.deleteMany({});
    res.send(result).status(200); 
});

export default router;
