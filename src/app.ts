import "./setup";

import express from "express";
import cors from "cors";
import "reflect-metadata";

import connectDatabase from "./database";

import error from "../src/middlewares/errorMiddlewares";
import authMiddleware from "../src/middlewares/authMiddleware";
import * as userController from "./controllers/userController";
import * as transactionController from "./controllers/transactionController";

const app = express();
app.use(cors());
app.use(express.json());
app.use(error);


app.post("/sign-up", userController.signUp);
app.post("/sign-in", userController.signIn);
app.post("/entrance", authMiddleware ,transactionController.entrance);



export async function init () {
  await connectDatabase();
}

export default app;
