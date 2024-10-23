import { Router } from "express";
import { CreateCustomerController } from "../modules/user/create-user/controller/create-user.controller";
import { AuthController } from "../modules/auth/controller/auth.controller";
import { isAuth } from "../middleware/autheticationMiddleware";
import { CheckRole } from "../middleware/checkRoleMiddleware";
import { CreateUserClerkController } from "../modules/user/create-user-clerk/controller/create-user-clerk.controller";

const router = Router();

const CreateUserNonClerk = new CreateCustomerController();
const authController = new AuthController();
const checkRole = new CheckRole();
const createUserClerk = new CreateUserClerkController();

router.post("/user/register", CreateUserNonClerk.handle);
router.post(
	"/user/register/clerk/",
	isAuth,
	checkRole.checkRoleMiddleware("Admin"),
	createUserClerk.handle,
);

router.post("/login", authController.handle);

export { router };
