import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./routes/todo.router.js";
import routerUser from "./routes/user.router.js";

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Starting Mongodb Server
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log(`Connected to MongoDB Server`);
  });
}

// Routes
app.use(router);
app.use(routerUser);

// Starting Express Server
const port = process.env.PORT;
app.listen(port, () => console.log(`ToDo-App listening on port ${port}!`));
