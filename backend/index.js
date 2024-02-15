import express from "express";
import userRouter from "./routes/user.route.js";
import storiesRoute from "./routes/stories.route.js";
import { auth } from 'express-oauth2-jwt-bearer';

const app = express();

app.use(express.json());

const jwtCheck = auth({
    audience: 'apple',
    issuerBaseURL: 'https://narrativenet.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

app.use("/api/user", jwtCheck, userRouter);
app.use("/api/story", jwtCheck, storiesRoute);
app.use("/api/getstory", storiesRoute);


app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 500;
    res.status(status).send(message);
});

app.listen(3000, () => {
    console.log("connected to the server 3000");
});
