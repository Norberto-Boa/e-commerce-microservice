import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { CreateCustomerController } from "./create-user.controller";
import { CreateClientUseCase } from "../useCase/create-user.use-case";
import { GetRoleByNameUseCase } from "../../../role/get-role-by-name/usecase/get-role-by-name.usecase";
import { ZodError, type z } from "zod";
import { createUserValidator } from "../validators/create-user";
import type { Role, User } from "@prisma/client";
import { errorHandler } from "../../../../middleware/errorHandler";

// Mock the GetRoleByNameUseCase
vi.mock(
	"../../../role/get-role-by-name/usecase/get-role-by-name.usecase",
	() => ({
		GetRoleByNameUseCase: vi.fn().mockImplementation(() => ({
			execute: vi.fn(),
		})),
	}),
);

// Mock the validator
vi.mock("../../create-user/validators/create-user", () => ({
	createUserValidator: {
		parse: vi.fn(),
	},
}));

// Mock the CreateClientUseCase
vi.mock("../useCase/create-user.use-case", () => ({
	CreateClientUseCase: vi.fn().mockImplementation(() => ({
		execute: vi.fn(),
	})),
}));

describe("CreateCustomerController", () => {
	let createCustomerController: CreateCustomerController;
	let mockGetRoleByNameUseCase: InstanceType<typeof GetRoleByNameUseCase>;
	let mockCreateClientUseCase: InstanceType<typeof CreateClientUseCase>;

	const mockRequest = (
		body: z.infer<typeof createUserValidator>,
	): Partial<Request> => ({
		body,
	});

	const mockResponse = (): Partial<Response> => {
		const res: Partial<Response> = {};
		res.status = vi.fn().mockReturnThis();
		res.json = vi.fn().mockReturnThis();
		return res;
	};

	const mockNext = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		mockGetRoleByNameUseCase = new GetRoleByNameUseCase();
		mockCreateClientUseCase = new CreateClientUseCase();

		createCustomerController = new CreateCustomerController(
			mockGetRoleByNameUseCase,
			mockCreateClientUseCase,
		);
	});

	it("should return 201 and the created client on success", async () => {
		const req = mockRequest({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "securepassword",
			cpassword: "securepassword",
			phone: "1234567890",
			roleName: "Customer",
		});

		const res = mockResponse();

		const createdAt = new Date();
		const updatedAt = new Date();

		(createUserValidator.parse as Mock).mockReturnValue(req.body);

		(mockGetRoleByNameUseCase.execute as Mock).mockReturnValue({
			id: "1",
			name: "Vendor",
			createdAt: new Date(),
			updatedAt: new Date(),
		} as Role);

		(mockCreateClientUseCase.execute as Mock).mockReturnValue({
			id: "1",
			name: "John Doe",
			email: "johndoe@example.com",
			password: "hashedPassword",
			phone: "123456789",
			role_id: "1",
			createdAt,
			updatedAt,
		} as User);

		await createCustomerController.handle(req as Request, res as Response);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			id: "1",
			name: "John Doe",
			email: "johndoe@example.com",
			password: "hashedPassword",
			phone: "123456789",
			role_id: "1",
			createdAt,
			updatedAt,
		});
	});

	it("should return 400 and an error message when validation fails", async () => {
		const req = mockRequest({
			name: "",
			roleName: "Vendor",
			password: "short",
			cpassword: "short",
			email: "johndoe@example",
			phone: "ascsd123243",
		});

		const res = mockResponse();

		(createUserValidator.parse as Mock).mockImplementation(() => {
			throw new ZodError([
				{
					path: ["name"],
					message: "Name is required",
					code: "invalid_type",
					expected: "string",
					received: "undefined",
				},
			]);
		});

		try {
			await createCustomerController.handle(req as Request, res as Response);
		} catch (error) {
			errorHandler(
				error as Error,
				req as Request,
				res as Response,
				mockNext as NextFunction,
			);
		}

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			errors: [{ field: "name", message: "Name is required" }],
			message: "Invalid data",
		});
	});

	it("should throw an error when role is a clerk(Admin, Support Agent, Manager)", async () => {
		const req = mockRequest({
			name: "John Doe",
			roleName: "Admin",
			password: "short",
			cpassword: "short",
			email: "johndoe@example",
			phone: "ascsd123243",
		});

		const res = mockResponse();

		(createUserValidator.parse as Mock).mockResolvedValue(req.body);

		try {
			await createCustomerController.handle(req as Request, res as Response);
		} catch (error) {
			errorHandler(
				error as Error,
				req as Request,
				res as Response,
				mockNext as NextFunction,
			);
		}

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Invalid role!",
		});
	});
});
