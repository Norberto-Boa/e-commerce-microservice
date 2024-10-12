import { Router } from "express";
import { CreateCustomerController } from "../modules/create-client/controller/create-user.controller";

const router = Router();

const createClientController = new CreateCustomerController();

router.post("/client", createClientController.handle);

export { router };
