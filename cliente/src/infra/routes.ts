import { Router } from "express";
import { CreateCustomerController } from "../modules/user/create-user/controller/create-user.controller";
import { AuthController } from "../modules/auth/controller/auth.controller";

const router = Router();

const createClientController = new CreateCustomerController();
const authController = new AuthController();

router.post("/user/register", createClientController.handle);
router.post("/login", authController.handle);

export { router };
