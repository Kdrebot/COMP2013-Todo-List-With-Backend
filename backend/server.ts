//Imports
import express, { type Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import Task from "./models/task";

//Main Variables
const server: Express = express();
const port: number = 3000;
const { MONGO_URI } = process.env;

//Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

//Connection
if (!MONGO_URI) {
  throw new Error("MongoDB URI is missing from the .env file");
}

mongoose
  .connect(MONGO_URI)
  .then(() =>
    server.listen(port, () => {
      console.log(`Connected to DB \nListening to port ${port}`);
    }),
  )
  .catch((error) => console.log(error));

//Routes
//Index Route (/)
server.get("/", (request, response) => {
  response.send("Server is Live!");
});

//API data route
server.get("/data", async (request, response) => {
  try {
    const data = await Task.find(); //go grab all entries from DB
    response.status(200).send(data); //Then send an OK response coupled with the data
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//POST Task route
server.post("/data", async (request, response) => {
  //grab the data sent over from the frontend via request body
  const { id, title, checked } = request.body;
  //create a new task instance and add the id, title, and checked
  const newTask = new Task({
    id,
    title,
    checked,
  });
  try {
    await newTask.save(); //wait for it to be saved on the DB
    response.status(201).send("Task has been added successfully");
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//DELETE Task Route
server.delete("/data/:id", async (request, response) => {
  const { id } = request.params;
  try {
    await Task.findOneAndDelete({ id });
    response.status(201).send(`Task with id ${id} has been deleted`);
  } catch (error) {
    console.log(error);
    response.status(500).send();
  }
});
