import { Router } from "express";

import {
  signUpUser,
  signInUser,
  deleteUser,
  changePassword,
} from "../controllers/user.controller.js";

const routerUser = Router();

routerUser.post("/user/signup", signUpUser);

routerUser.post("/user/signin", signInUser);

routerUser.put("/user/update", changePassword);

routerUser.delete("/user/delete", deleteUser);

export default routerUser;
