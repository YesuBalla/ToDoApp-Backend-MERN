import { Router } from "express";
import multer from "multer";

import {
  createToDo,
  readToDo,
  updateToDo,
  deleteToDo,
  bulkUploadTodos,
} from "../controllers/todo.controller.js";

const routerToDo = Router();

routerToDo.post("/todo/create", createToDo);

routerToDo.get("/todo/read", readToDo);

routerToDo.put("/todo/update", updateToDo);

routerToDo.delete("/todo/delete", deleteToDo);

routerToDo.post(
  "/todo/bulkUpload",
  multer({ dest: "tmp/csv/" }).single("csvFile"),
  bulkUploadTodos
);

export default routerToDo;
