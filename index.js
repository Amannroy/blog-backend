import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import postRouter from "./routes/posts.js";

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/uploads", express.static("uploads"));
app.use("/api/posts", postRouter);

const CONNECTION_URL =
  "mongodb+srv://blogProject:blogProject123@blogproject.e1qwi.mongodb.net/?retryWrites=true&w=majority&appName=blogproject";

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
