import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import skills from "./routes/skills.route.js";
import projects from "./routes/projects.route.js";
import posts from "./routes/posts.route.js";
import experience from "./routes/experience.routes.js"
import achievements from "./routes/achievements.route.js"


const PORT = process.env.PORT || 4000;

const app = express()

// add middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ exteded : false}));


// load routes
app.use('/skills', skills)
app.use('/projects', projects)
app.use('/posts', posts)
app.use('/experience', experience)
app.use('/achievements', achievements)


// start the server
app.listen(PORT,() => {
    console.log(`server is running on port : ${PORT}`)
}
    );