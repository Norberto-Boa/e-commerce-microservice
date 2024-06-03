import { Router } from "express";
import { CreateOrderController } from "../modules/create-order/create-order.controller";

const createOrder = new CreateOrderController();

const router = Router();

router.post("/order", createOrder.handle);

export { router };