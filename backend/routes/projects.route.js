import { Router } from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = Router();
const PROJECTS_COLLECTION = db.collection("projects");

// Endpoint for getting list of projects
router.get('/', async (req, res) => {
    try {
        let results = await PROJECTS_COLLECTION.find({}).toArray();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for getting a single project by id
router.get('/:id', async (req, res) => {
    try {
        let query = { _id: new ObjectId(req.params.id) };
        let result = await PROJECTS_COLLECTION.findOne(query);
        if (!result) {
            res.status(404).json({ message: "Project Not Found" });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for adding a single project
router.post("/", async (req, res) => {
    try {
        let newProject = {
            title:req.body.title,
            description: req.body.description,
            image: req.body.image,
            live_demo: req.body.live_demo
        }
        let result = await PROJECTS_COLLECTION.insertOne(newProject);
        res.send(result).status(201)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for updating a project by the Id
router.patch('/:id', async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = { $set: {
            title:req.body.title,
            description: req.body.description,
            image: req.body.image,
            live_demo: req.body.live_demo
        }};

        let result = await PROJECTS_COLLECTION.updateOne(query, updates);
        if (result.modifiedCount === 0) {
            res.status(404).json({ message: "Project Not Found" });
        } else {
            res.status(200).json({ message: "Project Updated Successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for deleting a project by id
router.delete('/:id', async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        let result = await PROJECTS_COLLECTION.deleteOne(query);
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Project Not Found" });
        } else {
            res.status(200).json({ message: "Project Deleted Successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for deleting all projects
router.delete('/', async(req, res) => {
    let result = await PROJECTS_COLLECTION.deleteMany({});
    res.send(result).status(200); 
});

export default router;
