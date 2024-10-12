import { Router } from "express";
import { CreateCustomerController } from "../modules/user/create-user/controller/create-user.controller";
import { AuthController } from "../modules/auth/controller/auth.controller";
import { isAuth } from "../middleware/autheticationMiddleware";
import { CheckRole } from "../middleware/checkRoleMiddleware";

const router = Router();

const createClientController = new CreateCustomerController();
const authController = new AuthController();
const checkRole = new CheckRole();

router.post("/user/register", createClientController.handleCustomer);
router.post(
	"/user/register/clerk/",
	isAuth,
	checkRole.checkRoleMiddleware("Admin"),
	createClientController.handleClerk,
);

router.post("/login", authController.handle);

export { router };
