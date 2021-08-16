import "./setup";

import express from "express";
import cors from "cors";
import "reflect-metadata";

import connectDatabase from "./database";

import {error} from "../src/middlewares/errorMiddlewares";
import * as userController from "./controllers/userConroller";

const app = express();
app.use(cors());
app.use(express.json());
app.use(error);


app.post("/sign-up", userController.signUp);


export async function init () {
  await connectDatabase();
}

export default app;
