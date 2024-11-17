import express from "express";
import { userSignOut, userSignIn, userSignUp } from "../controllers/auth.controller.js";

const app = express();

app.post('/sign-up', userSignUp);
app.post('/sign-in', userSignIn);
app.post('/sign-out', userSignOut);

export default app;