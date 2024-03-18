import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import skills from "./routes/skills.route.js"

const PORT = process.env.PORT || 4000;

const app = express()

// add middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ exteded : false}));


// 
app.use('/skills', skills)
// start the server
app.listen(PORT,() => {
    console.log(`server is running on port : ${PORT}`)
}
    );