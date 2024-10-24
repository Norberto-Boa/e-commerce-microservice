import { Router } from "express";
import { CreateCustomerController } from "../modules/user/create-user/controller/create-user.controller";
import { AuthController } from "../modules/auth/controller/auth.controller";
import { isAuth } from "../middleware/autheticationMiddleware";
import { CheckRole } from "../middleware/checkRoleMiddleware";
import { CreateUserClerkController } from "../modules/user/create-user-clerk/controller/create-user-clerk.controller";
import { CreateClientUseCase } from "../modules/user/create-user/useCase/create-user.use-case";
import { GetRoleByNameUseCase } from "../modules/role/get-role-by-name/usecase/get-role-by-name.usecase";

const router = Router();

const CreateUserNonClerk = new CreateCustomerController();
const authController = new AuthController();
const checkRole = new CheckRole();
const createUserClerk = new CreateUserClerkController(
	new CreateClientUseCase(),
	new GetRoleByNameUseCase(),
);

router.post("/user/register", CreateUserNonClerk.handle);
router.post(
	"/user/register/clerk/",
	isAuth,
	checkRole.checkRoleMiddleware("Admin"),
	createUserClerk.handle,
);

router.post("/login", authController.handle);

export { router };
