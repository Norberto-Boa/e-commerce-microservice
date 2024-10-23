import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Request, Response } from "express";
import { CreateCustomerController } from "./create-user.controller";
import { CreateClientUseCase } from "../useCase/create-user.use-case";

// Mock the CreateClientUseCase
vi.mock("./create-client.use-case", () => ({
	CreateClientUseCase: vi.fn().mockImplementation(() => ({
		execute: vi.fn(),
	})),
}));

// Helper function to create a mock response object
const createMockResponse = () => {
	const res: Partial<Response> = {};
	res.status = vi.fn().mockReturnThis();
	res.json = vi.fn().mockReturnThis();
	return res as Response;
};

describe("CreateCustomerController", () => {
	let createCustomerController: CreateCustomerController;
	let req: Partial<Request>;
	let res: Response;
	let MockedCreateClientUseCase: any;

	beforeEach(() => {
		createCustomerController = new CreateCustomerController();
		req = {};
		res = createMockResponse();
		vi.clearAllMocks();
		MockedCreateClientUseCase = {
			execute: vi.fn(),
		};
	});

	it("should return 201 and the created client on success", async () => {
		const clientData = {
			name: "John Doe",
			email: "johndoe@example.com",
			password: "securepassword",
			cpassword: "securepassword",
			phone: "1234567890",
			roleName: "Customer",
		};

		req.body = clientData;
		MockedCreateClientUseCase.execute.mockResolvedValue(clientData);

		await createCustomerController.handleClerk(req as Request, res);

		expect(MockedCreateClientUseCase.prototype.execute).toHaveBeenCalledWith(
			clientData,
		);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(clientData);
	});

	it("should return 400 and an error message if client already exists", async () => {
		const clientData = {
			name: "John Doe",
			email: "johndoe@example.com",
			password: "securepassword",
			phone: "1234567890",
		};

		req.body = clientData;
		const error = new Error("Customer already exists!");
		MockedCreateClientUseCase.prototype.execute.mockRejectedValue(error);

		await createCustomerController.handleClerk(req as Request, res);

		expect(MockedCreateClientUseCase.prototype.execute).toHaveBeenCalledWith(
			clientData,
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(error);
	});
});
