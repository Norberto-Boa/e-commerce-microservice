import { Router } from "express";
import { CreateProductController } from "../modules/create-product/create-product.controller";

const router = Router();

const createProductController = new CreateProductController();

router.post('/products', createProductController.handle);

export { router };